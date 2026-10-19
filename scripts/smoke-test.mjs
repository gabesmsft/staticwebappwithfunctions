import assert from "node:assert/strict";

const baseUrl = process.env.APP_URL;
assert.ok(baseUrl, "Set APP_URL to the deployed site or local SWA emulator URL.");

const home = await fetch(new URL("/", baseUrl));
assert.equal(home.status, 200, "The frontend must return HTTP 200.");
assert.match(await home.text(), /id="message"/);

const script = await fetch(new URL("/app.js", baseUrl));
assert.equal(script.status, 200, "The frontend script must return HTTP 200.");
assert.match(await script.text(), /\/api\/message/);

const api = await fetch(new URL("/api/message", baseUrl));
assert.equal(api.status, 200, "The API must return HTTP 200.");
assert.match(api.headers.get("content-type"), /application\/json/);
assert.deepEqual(await api.json(), { text: "Hello from .NET 10 Azure Functions!" });

console.log(`Frontend and .NET 10 API smoke tests passed: ${baseUrl}`);
