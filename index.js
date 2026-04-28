import { createTeams, teamsToString } from "./createTeam.js";
import { members, TEAM_SIZE } from "./data.js";
import { getKstDateContext } from "./dateUtils.js";
import { sendWebhook } from "./MMdeploy.js";
import {
  loadPreviousTeams,
  loadPreviousWeights,
  saveRunResult,
  saveWeights,
} from "./setLog.js";

function getBaseMembers() {
  const previousMembers = loadPreviousTeams();
  return previousMembers ?? members;
}

function shouldPersistLogs() {
  return process.env.PERSIST_LOGS !== "false";
}

async function deploy() {
  const baseMembers = getBaseMembers();
  const weights = loadPreviousWeights(baseMembers);
  const teams = createTeams(baseMembers, weights, TEAM_SIZE);
  const message = teamsToString(teams, getKstDateContext().displayDate);

  await sendWebhook(message);

  if (shouldPersistLogs()) {
    saveRunResult(teams);
    saveWeights(weights);
    return;
  }

  console.log("Skipped log persistence for test run");
}

deploy();
