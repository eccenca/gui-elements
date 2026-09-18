import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { createServer } from "node:http";
import type { Socket } from "node:net";
import { dirname, extname, resolve, sep } from "node:path";
import process from "node:process";
import { fileURLToPath, URL } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const buildRoot = resolve(packageRoot, ".local/storybook");
await access(resolve(buildRoot, "index.json"));
const contentTypes: Partial<Record<string, string>> = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
};
const server = createServer(async (request, response) => {
    try {
        const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
        const file = resolve(buildRoot, `.${pathname === "/" ? "/index.html" : pathname}`);
        if (!file.startsWith(buildRoot + sep) || !(await stat(file)).isFile()) {
            response.writeHead(404).end();
            return;
        }
        response.writeHead(200, { "Content-Type": contentTypes[extname(file)] ?? "application/octet-stream" });
        createReadStream(file)
            .on("error", () => response.destroy())
            .pipe(response);
    } catch {
        response.writeHead(404).end();
    }
});
const sockets = new Set<Socket>();
server.on("connection", (socket) => {
    sockets.add(socket);
    socket.once("close", () => sockets.delete(socket));
});
await new Promise<void>((ready, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => ready());
});
const address = server.address();
if (!address || typeof address === "string") throw new Error("Expected a TCP server address");
const runner = resolve(packageRoot, "scripts/run-storybook-tests.mts");
const child = spawn(
    process.execPath,
    [runner, "--url", `http://127.0.0.1:${address.port}`, "--ci", ...process.argv.slice(2)],
    { cwd: packageRoot, stdio: "inherit" },
);
const stop = () => child.kill("SIGTERM");
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
try {
    process.exitCode = await new Promise<number>((done, reject) => {
        child.once("error", reject);
        child.once("exit", (code) => done(code ?? 1));
    });
} finally {
    process.removeListener("SIGINT", stop);
    process.removeListener("SIGTERM", stop);
    for (const socket of sockets) socket.destroy();
    await new Promise<void>((done, reject) => {
        server.close((error) => (error ? reject(error) : done()));
    });
}
