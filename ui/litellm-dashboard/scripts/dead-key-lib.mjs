export function parseDeadKeysOutput(stdout) {
  const dead = [];
  let inDeadSection = false;
  for (const line of stdout.split("\n")) {
    if (line.startsWith("catalog=")) {
      inDeadSection = true;
      continue;
    }
    if (!inDeadSection) continue;
    const match = /^ {3}(\S+)\s+=>/.exec(line);
    if (match) {
      dead.push(match[1]);
      continue;
    }
    if (line.startsWith("## ")) continue;
    if (line.trim() === "") continue;
    if (!line.startsWith("   ")) inDeadSection = false;
  }
  return dead.sort();
}

export function findNewDeadKeys(dead, baseline) {
  const known = new Set(baseline);
  return dead.filter((key) => !known.has(key)).sort();
}

export function findResolvedDeadKeys(dead, baseline) {
  const current = new Set(dead);
  return baseline.filter((key) => !current.has(key)).sort();
}
