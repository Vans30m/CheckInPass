import http from "node:http";

/**
 * Super lightweight in-memory HTTP test client for Express without external dependencies
 */
export const request = (app) => {
    const makeRequest = (method, url, options = {}) => {
        return new Promise((resolve, reject) => {
            const server = http.createServer(app);
            server.listen(0, () => {
                const port = server.address().port;
                const reqHeaders = { ...(options.headers || {}) };
                let body = options.body;

                if (body && typeof body === "object" && !(body instanceof Buffer)) {
                    body = JSON.stringify(body);
                    if (!reqHeaders["content-type"]) {
                        reqHeaders["content-type"] = "application/json";
                    }
                }

                if (body) {
                    reqHeaders["content-length"] = Buffer.byteLength(body);
                }

                const clientReq = http.request(
                    {
                        hostname: "127.0.0.1",
                        port,
                        path: url,
                        method,
                        headers: reqHeaders,
                    },
                    (res) => {
                        const chunks = [];
                        res.on("data", (chunk) => chunks.push(chunk));
                        res.on("end", () => {
                            server.close();
                            const raw = Buffer.concat(chunks).toString("utf8");
                            let json = null;
                            try {
                                json = JSON.parse(raw);
                            } catch (e) {
                                // Not JSON
                            }
                            resolve({
                                status: res.statusCode,
                                statusCode: res.statusCode,
                                headers: res.headers,
                                body: json !== null ? json : raw,
                                text: raw,
                            });
                        });
                    }
                );

                clientReq.on("error", (err) => {
                    server.close();
                    reject(err);
                });

                if (body) {
                    clientReq.write(body);
                }
                clientReq.end();
            });
        });
    };

    return {
        get: (url, options) => makeRequest("GET", url, options),
        post: (url, options) => makeRequest("POST", url, options),
        put: (url, options) => makeRequest("PUT", url, options),
        delete: (url, options) => makeRequest("DELETE", url, options),
    };
};

