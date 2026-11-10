import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import { inMemoryDb, createMockUserModel } from "./helpers/mockModels.js";

const mockUser = createMockUserModel();

// Stub User.findById for in-memory testing
User.findById = mockUser.findById;
User.create = mockUser.create;

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

describe("1. Authentication & Session Lifecycle Tests (auth.test.js)", () => {
    beforeEach(() => {
        inMemoryDb.clear();
    });

    describe("Token Creation, Verification, & Expiration", () => {
        it("should successfully generate a JWT token with valid payload and signature", () => {
            const payload = { userId: "user_12345", role: "user" };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

            assert.ok(token);
            const decoded = jwt.verify(token, JWT_SECRET);
            assert.equal(decoded.userId, "user_12345");
            assert.equal(decoded.role, "user");
            assert.ok(decoded.exp > decoded.iat);
        });

        it("should reject token signed with an invalid/tampered secret key", () => {
            const token = jwt.sign({ userId: "user_evil" }, "wrong_secret");
            assert.throws(() => {
                jwt.verify(token, JWT_SECRET);
            }, /invalid signature/);
        });

        it("should reject an expired token (TokenExpiredError)", () => {
            const token = jwt.sign({ userId: "user_expired" }, JWT_SECRET, { expiresIn: "-1s" });
            assert.throws(() => {
                jwt.verify(token, JWT_SECRET);
            }, (err) => {
                return err.name === "TokenExpiredError";
            });
        });
    });

    describe("Cryptographic Hashing Verification (PBKDF2 / Argon2 / bcrypt equivalents)", () => {
        it("should compute deterministic secure salt and cryptographic hash", () => {
            const password = "SuperSecretPassword123!";
            const salt = crypto.randomBytes(16).toString("hex");
            const hash1 = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
            const hash2 = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

            assert.equal(hash1, hash2, "Identical password and salt must verify successfully");
            
            const wrongHash = crypto.pbkdf2Sync("WrongPassword", salt, 10000, 64, "sha512").toString("hex");
            assert.notEqual(hash1, wrongHash, "Mismatched password must produce different hash");
        });
    });

    describe("Refresh Token Rotation & Token Family Tracking (Reuse Detection)", () => {
        it("should detect reuse of an invalidated refresh token and revoke family", () => {
            // Enterprise token family tracking simulation
            const tokenFamilies = new Map();

            function issueFamily(userId) {
                const familyId = crypto.randomUUID();
                const activeToken = crypto.randomBytes(32).toString("hex");
                tokenFamilies.set(familyId, { userId, activeToken, invalidated: false });
                return { familyId, refreshToken: activeToken };
            }

            function rotateToken(familyId, presentedToken) {
                const record = tokenFamilies.get(familyId);
                if (!record || record.invalidated) {
                    throw new Error("REVOKED_FAMILY: Potential token theft detected");
                }
                if (record.activeToken !== presentedToken) {
                    // Token reuse detected! Invalidate entire family immediately
                    record.invalidated = true;
                    throw new Error("TOKEN_REUSE_DETECTED: Invalidating family");
                }
                // Rotate
                const nextToken = crypto.randomBytes(32).toString("hex");
                record.activeToken = nextToken;
                return nextToken;
            }

            const { familyId, refreshToken } = issueFamily("user_victim");
            
            // Legitimate rotation 1
            const nextToken = rotateToken(familyId, refreshToken);
            assert.ok(nextToken);

            // Attacker presents the old, already-rotated refresh token
            assert.throws(() => {
                rotateToken(familyId, refreshToken);
            }, /TOKEN_REUSE_DETECTED/);

            // Legitimate user tries to use nextToken, but family was invalidated due to breach
            assert.throws(() => {
                rotateToken(familyId, nextToken);
            }, /REVOKED_FAMILY/);
        });
    });

    describe("Logout and Multi-Device Session Revocation Logic", () => {
        it("should successfully revoke sessions on multi-device logout", () => {
            const activeSessions = new Map();

            function createSession(userId, deviceId) {
                const sessionId = `${userId}_${deviceId}`;
                activeSessions.set(sessionId, { userId, deviceId, active: true, createdAt: Date.now() });
                return sessionId;
            }

            function revokeAllSessions(userId) {
                for (const [key, session] of activeSessions.entries()) {
                    if (session.userId === userId) {
                        activeSessions.delete(key);
                    }
                }
            }

            createSession("user_1", "iphone");
            createSession("user_1", "macbook");
            createSession("user_2", "android");

            assert.equal(activeSessions.size, 3);

            // User 1 logs out from all devices
            revokeAllSessions("user_1");

            assert.equal(activeSessions.size, 1);
            assert.ok(!activeSessions.has("user_1_iphone"));
            assert.ok(!activeSessions.has("user_1_macbook"));
            assert.ok(activeSessions.has("user_2_android"));
        });
    });

    describe("Authentication Middleware (protect) Unit Testing", () => {
        it("should return 401/unauthorized if no token is provided in request headers", async () => {
            const req = { headers: {} };
            let responseData = null;
            const res = {
                json: (data) => { responseData = data; }
            };
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            await protect(req, res, next);
            assert.equal(nextCalled, false);
            assert.equal(responseData.success, false);
            assert.match(responseData.message, /No token provided/i);
        });

        it("should authenticate and attach req.user if Bearer token is valid", async () => {
            const testUser = await mockUser.create({
                _id: "valid_user_1",
                username: "alice",
                email: "alice@example.com",
                image: "https://example.com/pic.jpg",
                role: "user"
            });

            const token = jwt.sign({ userId: testUser._id }, JWT_SECRET);
            const req = {
                headers: {
                    authorization: `Bearer ${token}`
                }
            };
            const res = { json: () => {} };
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            await protect(req, res, next);
            assert.equal(nextCalled, true);
            assert.equal(req.user._id, "valid_user_1");
            assert.equal(req.user.username, "alice");
        });

        it("should return error if token references a deleted/non-existent user", async () => {
            const token = jwt.sign({ userId: "non_existent_id" }, JWT_SECRET);
            const req = {
                headers: {
                    authorization: `Bearer ${token}`
                }
            };
            let responseData = null;
            const res = {
                json: (data) => { responseData = data; }
            };
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            await protect(req, res, next);
            assert.equal(nextCalled, false);
            assert.equal(responseData.success, false);
            assert.match(responseData.message, /User not found/i);
        });
    });
});
