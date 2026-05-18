const assert = require("assert");
const fs = require("fs");

function read(path) {
  assert.ok(fs.existsSync(path), `${path} should exist`);
  return fs.readFileSync(path, "utf8");
}

const api = read("frontend/src/api/index.js");
const frontendPackage = JSON.parse(read("frontend/package.json"));
const setupProxy = read("frontend/src/setupProxy.js");
assert.match(
  api,
  /process\.env\.REACT_APP_API_URL\s*\|\|\s*["']\/api["']/,
  "frontend should use same-origin /api by default"
);
assert.doesNotMatch(
  api,
  /http:\/\/localhost:5000\/api/,
  "frontend production build must not call localhost:5000"
);
assert.ok(
  !Object.prototype.hasOwnProperty.call(frontendPackage, "proxy"),
  "frontend package.json should not use CRA string proxy because it can break allowedHosts on servers"
);
assert.match(
  setupProxy,
  /app\.use\(\s*['"]\/api['"]/,
  "frontend dev server should proxy /api when running without Docker"
);
assert.match(
  setupProxy,
  /process\.env\.REACT_APP_API_PROXY\s*\|\|\s*['"]http:\/\/localhost:5000['"]/,
  "frontend dev proxy should default to the local backend"
);

const server = read("backend/server.js");
assert.match(
  server,
  /process\.env\.PORT\s*\|\|\s*5000/,
  "backend port should be configurable"
);
assert.match(
  server,
  /process\.env\.DB_PATH\s*\|\|/,
  "backend sqlite path should be configurable for Docker volume"
);
assert.match(
  server,
  /process\.env\.CORS_ORIGIN\s*\|\|/,
  "backend CORS origin should be configurable"
);

const backendDockerfile = read("backend/Dockerfile");
assert.match(
  backendDockerfile,
  /npm ci --omit=dev/,
  "backend image should install production dependencies reproducibly"
);
assert.match(
  backendDockerfile,
  /CMD \["node", "server\.js"\]/,
  "backend image should run server.js"
);

const frontendDockerfile = read("frontend/Dockerfile");
assert.match(
  frontendDockerfile,
  /npm ci/,
  "frontend image should install dependencies reproducibly"
);
assert.match(
  frontendDockerfile,
  /npm run build/,
  "frontend image should build static assets"
);
assert.match(
  frontendDockerfile,
  /nginx/,
  "frontend image should serve with nginx"
);

const nginx = read("frontend/nginx.conf");
assert.match(
  nginx,
  /proxy_pass http:\/\/backend:5000/,
  "nginx should proxy API requests to backend service"
);
assert.match(
  nginx,
  /try_files \$uri \/index\.html/,
  "nginx should support SPA routes"
);

const compose = read("docker-compose.yml");
assert.match(
  compose,
  /backend_data:\/data/,
  "compose should persist backend sqlite data in a Docker volume"
);
assert.match(
  compose,
  /"127\.0\.0\.1:8080:80"/,
  "compose should expose the frontend only on localhost for the host nginx proxy"
);
assert.match(
  compose,
  /depends_on:\s*\n\s*- backend/,
  "frontend should depend on backend service"
);

console.log("deploy config checks passed");
