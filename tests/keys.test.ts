import { expect, test } from "bun:test";
import { yundict } from "./client";

const TEST_TEAM_NAME = "cRFA5urX";
const TEST_PROJECT_NAME = "test-project";
const TEST_KEY_NAME = 'test-key';

test("Fetch all keys", async () => {
  const res = await yundict.keys.all({ team: TEST_TEAM_NAME, project: TEST_PROJECT_NAME })
  expect(res.success).toBeTrue()
  expect(res).toHaveProperty("data");
  expect(res.data?.keys).toBeArray();
  expect(res.data?.total).toBeNumber();
});

test("Create key", async () => {
  const data = {
    name: TEST_KEY_NAME,
    tags: ['test-tag'],
    translations: [
      {
        languageISO: 'en',
        content: 'Hello'
      }
    ]
  };
  const res = await yundict.keys.create({ team: TEST_TEAM_NAME, project: TEST_PROJECT_NAME }, data)
  expect(res.success).toBeTrue();
  expect(res.data).toMatchObject(data);
});

test("Update key", async () => {
  const res = await yundict.keys.update({
    team: TEST_TEAM_NAME,
    project: TEST_PROJECT_NAME,
    key: TEST_KEY_NAME
  }, {
    name: TEST_KEY_NAME,
    tags: ['testTag']
  })
  expect(res.success).toBeTrue();
  expect(res.data?.tags).toContain('testTag');
});

test("Export keys", async () => {
  const res = await yundict.keys.export({
    team: TEST_TEAM_NAME,
    project: TEST_PROJECT_NAME,
    type: "json",
    languages: ['en'],
  })
  expect(res.success).toBeTrue();
  expect(res.data).toStartWith("http");
});

test("Delete key", async () => {
  const res = await yundict.keys.delete({ team: TEST_TEAM_NAME, project: TEST_PROJECT_NAME, key: TEST_KEY_NAME })
  expect(res.success).toBeTrue();
});