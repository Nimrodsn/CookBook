import { spawn } from "node:child_process";
import os from "node:os";

// Port 3000 is blocked on some Windows machines (Hyper-V reserved range 2948-3047).
const PORT = 3048;
// Listen on all interfaces so phones on the same Wi-Fi can connect.
const HOST = "0.0.0.0";

function getLocalIPv4s() {
  const ips = [];
  for (const iface of Object.values(os.networkInterfaces())) {
    for (const addr of iface ?? []) {
      if (addr.family === "IPv4" && !addr.internal) {
        ips.push(addr.address);
      }
    }
  }
  return ips;
}

const lanIps = getLocalIPv4s();
console.log("\n  Cookbook dev server");
console.log(`  Local:   http://127.0.0.1:${PORT}`);
for (const ip of lanIps) {
  console.log(`  Phone:   http://${ip}:${PORT}  (same Wi-Fi)`);
}
if (lanIps.length === 0) {
  console.log("  Phone:   (no LAN IP found — check Wi-Fi connection)");
}
console.log("");

const child = spawn(
  "npx",
  ["next", "dev", "-p", String(PORT), "-H", HOST],
  { stdio: "inherit", shell: true },
);

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
