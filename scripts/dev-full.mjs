import { spawn } from "node:child_process";

const commands = [
  ["api", "node", ["server/src/index.js"]],
  ["web", "npm.cmd", ["run", "client", "--", "--config", "vite.config.js", "--port", "5174"]],
];

for (const [name, command, args] of commands) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    shell: true,
    stdio: "pipe",
  });

  child.stdout.on("data", (data) => process.stdout.write(`[${name}] ${data}`));
  child.stderr.on("data", (data) => process.stderr.write(`[${name}] ${data}`));
  child.on("exit", (code) => {
    if (code) process.exitCode = code;
  });
}
