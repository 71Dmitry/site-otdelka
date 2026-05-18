const assert = require("assert");
const http = require("http");
const https = require("https");
const { URL } = require("url");

const baseUrl = new URL(process.env.TEST_BASE_URL || "https://otdelka-profi-rostov.ru");

function getJson(path) {
  return new Promise((resolve, reject) => {
    const client = baseUrl.protocol === "https:" ? https : http;
    const req = client.get(
      {
        host: baseUrl.hostname,
        port: baseUrl.port || (baseUrl.protocol === "https:" ? 443 : 80),
        path,
        protocol: baseUrl.protocol,
        timeout: 5000,
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          try {
            assert.strictEqual(res.statusCode, 200);
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
      }
    );
    req.on("timeout", () => req.destroy(new Error("request timed out")));
    req.on("error", reject);
  });
}

(async () => {
  const services = await getJson("/api/services");
  assert.ok(Array.isArray(services), "services response should be an array");
  assert.ok(services.length > 0, "services seed data should be present");
  console.log("runtime checks passed");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
