import { expect, test } from "bun:test";
import { yundict, TEST_TEAM_NAME } from "./client";

test("Fetch teams", async () => {
  const res = await yundict.teams.all()
  expect(res.success).toBe(true);
  expect(res.data).toBeInstanceOf(Array);

  // Delete test team if it exists
  // const testTeam = res.data?.find(team => team.name === TEST_TEAM_NAME);
  // console.log("testTeam", res.data);
  // if (testTeam) {
  //   const deleteTeamRes = await yundict.teams.delete(testTeam.name);
  //   expect(deleteTeamRes.success).toBe(true);
  // }
});

test("Create team", async () => {
  const res = await yundict.teams.create({
    name: TEST_TEAM_NAME,
    displayName: "Test Team"
  });
  if (!res.success) console.error(res);
  expect(res.success).toBe(false);
});

test("Fetch team", async () => {
  const res = await yundict.teams.get(TEST_TEAM_NAME)
  if (!res.success) console.error(res);
  expect(res.success).toBe(true);
  expect(res.data?.name).toBe(TEST_TEAM_NAME);
});

test("Update team", async () => {
  const name = TEST_TEAM_NAME;
  const res = await yundict.teams.update(name, {
    displayName: "Test Team Yo~"
  });
  if (!res.success) console.error(res);
  expect(res.success).toBe(true);
});

test("Fetch team members", async () => {
  const res = await yundict.teams.members({ teamName: TEST_TEAM_NAME });
  if (!res.success) console.error(res);
  expect(res.success).toBe(true);
  expect(res.data).toBeInstanceOf(Array);
});

test("Reset team invite token", async () => {
  const res = await yundict.teams.resetInviteToken({ teamName: TEST_TEAM_NAME });
  if (!res.success) console.error(res);
  expect(res.success).toBe(true);
});

// test("Delete team", async () => {
//   const name = "test-team";
//   const res = await yundict.teams.delete(name);
//   expect(res.success).toBe(true);
// });