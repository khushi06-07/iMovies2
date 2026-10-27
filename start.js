const { spawn } = require('child_process');
const path = require('path');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('\x1b[36m%s\x1b[0m', '================================================');
console.log('\x1b[36m%s\x1b[0m', '        Starting IMovies Server & Client        ');
console.log('\x1b[36m%s\x1b[0m', '================================================');
console.log('• Backend API: http://localhost:5000');
console.log('• Frontend UI: http://localhost:5173\n');

const server = spawn('node', ['src/server.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: false
});

const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: isWin
});

function cleanup() {
  console.log('\nStopping IMovies servers...');
  try { server.kill(); } catch {}
  try { client.kill(); } catch {}
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
