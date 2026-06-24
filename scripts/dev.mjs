import { spawn } from "node:child_process";

// Port 3000 is blocked on some Windows machines (Hyper-V reserved range 2948-3047).
const PORT = 3048;
const HOST = "127.0.0.1";

const child = spawn(
  "npx",
  ["next", "dev", "-p", String(PORT), "-H", HOST],
  { stdio: "inherit", shell: true },
);

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
