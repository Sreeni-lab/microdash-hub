# Microdash Hub Backend

This is a simple Express server for backend health checks.

## Usage

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the server:
   ```sh
   npm start
   ```
3. Health check endpoint:
   - `GET /api/health-check?url=<serviceUrl>`
   - Returns `{ status: 200 }` if reachable, or error otherwise.

CORS is enabled for local frontend development.
