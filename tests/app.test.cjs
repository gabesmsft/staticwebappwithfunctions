const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");

const source = readFileSync(join(__dirname, "..", "src", "app.js"), "utf8");

async function render(fetch) {
  const message = { textContent: "Loading API message..." };
  const errors = [];
  await vm.runInNewContext(source, {
    document: {
      getElementById(id) {
        assert.equal(id, "message");
        return message;
      }
    },
    fetch,
    console: { error: (...args) => errors.push(args) }
  });
  return { message, errors };
}

test("renders the message from the same-origin API as text", async () => {
  const text = "<b>Hello from .NET 10 Azure Functions!</b>";
  const { message, errors } = await render(async (url) => {
    assert.equal(url, "/api/message");
    return { ok: true, json: async () => ({ text }) };
  });
  assert.equal(message.textContent, text);
  assert.equal(errors.length, 0);
});

for (const [name, fetch] of [
  ["HTTP failure", async () => ({ ok: false, status: 503 })],
  ["network failure", async () => { throw new Error("Network unavailable"); }],
  ["invalid JSON", async () => ({ ok: true, json: async () => { throw new SyntaxError("Invalid JSON"); } })],
  ["missing message", async () => ({ ok: true, json: async () => ({}) })],
  ["empty message", async () => ({ ok: true, json: async () => ({ text: "" }) })]
]) {
  test(`displays and logs an error for ${name}`, async () => {
    const { message, errors } = await render(fetch);
    assert.match(message.textContent, /Unable to load the API message/);
    assert.equal(errors.length, 1);
  });
}
