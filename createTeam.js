import { getKstDateContext } from "./dateUtils.js";

function shuffle(array = []) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  for (let i = 0; i < array.length; i++) {
    const j = Math.floor(Math.random() * array.length);
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export function calculateTeamSizes(totalMembers, teamSize) {
  if (totalMembers <= teamSize) {
    return [totalMembers];
  }

  const fullTeamCount = Math.floor(totalMembers / teamSize);
  const remainder = totalMembers % teamSize;

  if (remainder === 0) {
    return Array(fullTeamCount).fill(teamSize);
  }

  if (remainder === 1) {
    return [...Array(fullTeamCount - 1).fill(teamSize), teamSize + 1];
  }

  if (remainder === 2) {
    return [
      ...Array(fullTeamCount - 1).fill(teamSize),
      teamSize - 1,
      teamSize - 1,
    ];
  }

  return [...Array(fullTeamCount).fill(teamSize), remainder];
}

export function createTeams(members, weights, teamSize) {
  const teams = [];
  const usedMembers = new Set();
  const targetTeamSizes = calculateTeamSizes(members.length, teamSize);

  targetTeamSizes.forEach((targetTeamSize) => {
    const team = [];
    const availableMembers = shuffle(
      members.filter((member) => !usedMembers.has(member)),
    );

    while (team.length < targetTeamSize && availableMembers.length > 0) {
      availableMembers.sort((a, b) => {
        const weightA = team.reduce(
          (sum, member) => sum + (weights[member]?.[a] ?? 0),
          0,
        );
        const weightB = team.reduce(
          (sum, member) => sum + (weights[member]?.[b] ?? 0),
          0,
        );

        return weightA - weightB;
      });

      const selectedMember = availableMembers.shift();
      team.push(selectedMember);
      usedMembers.add(selectedMember);
    }

    teams.push(team);

    team.forEach((member) => {
      team.forEach((other) => {
        if (member !== other && weights[member]?.[other] !== undefined) {
          weights[member][other]++;
        }
      });
    });
  });

  return teams;
}

export function teamsToString(
  teams,
  displayDate = getKstDateContext().displayDate,
) {
  const { month, day } = displayDate;
  const title = `### :party_blob: :rice: ${month}월 ${day}일 밥 같이 먹어요 :rice: :party_blob: :cat_feed:`;
  const teamList = teams
    .map(
      (team, index) =>
        `**${index + 1}조 (${team.length}명)**  ➡  ${team.join("\t")}`,
    )
    .join("\n");

  return `${title}\n${teamList}`;
}
