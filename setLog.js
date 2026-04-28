import { existsSync, readFileSync, writeFileSync } from "fs";
import { getKstDateContext } from "./dateUtils.js";

const weightFilePath = "./logs/weightLogs.json";
const logFilePath = "./logs/logs.json";

function readJsonFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  const raw = readFileSync(filePath, "utf8").trim();
  if (!raw) {
    return {};
  }

  return JSON.parse(raw);
}

function writeJsonFile(filePath, data) {
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function flattenTeams(teams) {
  return teams.flat();
}

export function createInitialWeights(members) {
  const weights = {};

  members.forEach((member) => {
    weights[member] = {};
    members.forEach((other) => {
      if (member !== other) {
        weights[member][other] = 0;
      }
    });
  });

  return weights;
}

function applyTeamWeights(weights, teams) {
  teams.forEach((team) => {
    team.forEach((member) => {
      team.forEach((other) => {
        if (member !== other && weights[member]?.[other] !== undefined) {
          weights[member][other]++;
        }
      });
    });
  });
}

function readLogs() {
  return readJsonFile(logFilePath);
}

export function saveRunResult(teams) {
  const logs = readLogs();
  const { todayKey } = getKstDateContext();

  logs[todayKey] = {
    date: todayKey,
    members: flattenTeams(teams),
    teams,
  };

  writeJsonFile(logFilePath, logs);
  console.log("Saved teams for", todayKey);
}

export function saveWeights(weights) {
  writeJsonFile(weightFilePath, weights);
  console.log("Saved weights snapshot");
}

export function loadPreviousTeams() {
  const logs = readLogs();
  const { yesterdayKey } = getKstDateContext();

  return logs[yesterdayKey]?.members ?? null;
}

export function loadPreviousWeights(members) {
  const logs = readLogs();
  const { todayKey } = getKstDateContext();
  const weights = createInitialWeights(members);

  Object.entries(logs)
    .filter(([dateKey]) => dateKey < todayKey)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .forEach(([, entry]) => {
      if (Array.isArray(entry?.teams)) {
        applyTeamWeights(weights, entry.teams);
      }
    });

  return weights;
}
