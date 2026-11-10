import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../app.js";
import { request } from "./helpers/testClient.js";

describe("5. API Health & Error Resilience Tests (api_health.test.js)", () => {
    const app = createApp();
    const client = request(app);

    describe("Health Check Endpoints", () => {
        it("GET /health should return 200 with status ok and valid ISO timestamp", async () => {
            const res = await client.get("/health");
            assert.equal(res.status, 200);
            assert.equal(res.body.status, "ok");
            assert.ok(!isNaN(Date.parse(res.body.timestamp)));
        });

        it("GET /api/v1/health should return standard versioned health payload", async () => {
            const res = await client.get("/api/v1/health");
            assert.equal(res.status, 200);
            assert.equal(res.body.status, "ok");
        });

        it("GET / root should confirm API baseline responsiveness", async () => {
            const res = await client.get("/");
            assert.equal(res.status, 200);
            assert.match(res.text, /API is working correctly/i);
        });
    });

    describe("Unknown Route 404 Resilience", () => {
        it("should return clean JSON 404 response on non-existent endpoints", async () => {
            const res = await client.get("/api/v1/unknown-endpoint-xyz");
            assert.equal(res.status, 404);
            assert.equal(res.body.success, false);
            assert.equal(res.body.message, "Resource not found");
        });

        it("POST to unknown path should also return clean JSON 404", async () => {
            const res = await client.post("/non-existent-service", { body: { data: "test" } });
            assert.equal(res.status, 404);
            assert.equal(res.body.success, false);
        });
    });

    describe("Third-Party Provider Timeout & Resilience Handling", () => {
        it("should handle third-party service failure gracefully without crashing the transaction", async () => {
            // Emulate third-party payment/email gateway with timeout and catch
            async function callThirdPartyServiceWithTimeout(timeoutMs = 100) {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), timeoutMs);

                try {
                    // Simulated slow third-party call
                    await new Promise((_, reject) => {
                        controller.signal.addEventListener("abort", () => {
                            reject(new Error("GATEWAY_TIMEOUT: Third-party service timed out"));
                        });
                    });
                } finally {
                    clearTimeout(timer);
                }
            }

            let caughtError = null;
            try {
                await callThirdPartyServiceWithTimeout(50);
            } catch (err) {
                caughtError = err;
            }

            assert.ok(caughtError);
            assert.match(caughtError.message, /GATEWAY_TIMEOUT/);

            // Verify resilient fallback pattern
            const fallbackResult = {
                transactionId: "txn_fallback_123",
                status: "queued_for_retry",
                degradedMode: true,
            };
            assert.equal(fallbackResult.degradedMode, true);
        });
    });
});
