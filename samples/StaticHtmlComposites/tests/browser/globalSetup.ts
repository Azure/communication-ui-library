import * as http from 'http';
import { Server } from 'node-static';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function globalSetup() {
  var file = new Server(path.resolve(process.cwd(), 'dist'));
  const server = http
    .createServer(function (req, res) {
      file.serve(req, res);
    })
    .listen(8080);
  // await new Promise(done => server.listen(done));

  // Expose port to the tests.
  process.env.SERVER_PORT = String(server.address().toString());

  // Return the teardown function.
  return async () => {
    await new Promise((done) => server.close(done));
  };
}
export default globalSetup;
