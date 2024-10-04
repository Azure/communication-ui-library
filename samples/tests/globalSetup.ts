import * as http from 'http';
import express from 'express';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function globalSetup() {
  const fileServer = express();
  fileServer.use(express.static(path.resolve(process.cwd(), process.env.SERVE_PATH)));
  const server = http.createServer(fileServer).listen(8080);

  // Expose port to the tests.
  process.env.SERVER_PORT = String(server.address().toString());

  // Return the teardown function.
  return async () => {
    await new Promise((done) => server.close(done));
  };
}
export default globalSetup;
