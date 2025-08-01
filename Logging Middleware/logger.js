
const LOGGING_URL = "http://20.244.56.144/evaluation-service/logs";
const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMmJxMWExMjI5QHZ2aXQubmV0IiwiZXhwIjoxNzU0MDMwNjE0LCJpYXQiOjE3NTQwMjk3MTQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI1NGZlMDJjYy1hNDRjLTQxNTQtODRlOS1jMjJjZjViMmI5OWEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJjaGludGFrcmluZGkgbGFrc2htaSB2aXZlayIsInN1YiI6IjFkYzc3OTk1LWE4N2YtNDBjNC04ZTRhLWE3ODRmMzdjYmYwYyJ9LCJlbWFpbCI6IjIyYnExYTEyMjlAdnZpdC5uZXQiLCJuYW1lIjoiY2hpbnRha3JpbmRpIGxha3NobWkgdml2ZWsiLCJyb2xsTm8iOiIyMmJxMWExMjI5IiwiYWNjZXNzQ29kZSI6IlBuVkJGViIsImNsaWVudElEIjoiMWRjNzc5OTUtYTg3Zi00MGM0LThlNGEtYTc4NGYzN2NiZjBjIiwiY2xpZW50U2VjcmV0IjoieVBrR2ZiUGRNWlRVd1h5RyJ9.I72ey8HE4xI6Ve5qC4YJKa4u_oZZTfAX8bw0LdYx_Tw"; // Replace with your actual token

;

const validStacks = ['backend', 'frontend'];
const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
const validPackages = [
  'auth', 'config', 'middleware', 'utils',
  'cache', 'controller', 'cron job', 'db', 'domain',
  'handler', 'repository', 'route', 'service',
  'component', 'hook', 'page', 'state', 'style'
];

async function Log(stack, level, pkg, message) {
  try {
    if (!validStacks.includes(stack)) throw new Error(`Invalid stack: ${stack}`);
    if (!validLevels.includes(level)) throw new Error(`Invalid level: ${level}`);
    if (!validPackages.includes(pkg)) throw new Error(`Invalid package: ${pkg}`);

    const payload = {
      stack,
      level,
      package: pkg,
      message,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(LOGGING_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_TOKEN
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Log failed with status ${response.status}: ${errorBody}`);
    } else {
      console.log(`Log [${level}] sent: ${message}`);
    }

  } catch (err) {
    console.error('Logging Error:', err.message);
  }
}

export { Log };
