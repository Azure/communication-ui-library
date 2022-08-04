import { get } from "https";
import process from "process";

const POLL_INTERVAL_MS = 5 * 1000; // 5 seconds in millis
const TOTAL_TIME_TO_POLL_MS = 5 * 60 * 1000; // 5 minutes in millis
const MAX_RETRIES = TOTAL_TIME_TO_POLL_MS / POLL_INTERVAL_MS;

const makeRequest = (url) => {
  return new Promise((resolve, reject) => {
    get(url, (response) => {
      resolve(response);
    }).end();
  });
}

const sleep = (ms) => new Promise( res => setTimeout(res, ms));

const main = async () => {
  const url = process.argv[2];
  let retries = 0;
  while(true) {
    console.log('Pinging: ', url);
    const response = await makeRequest(url);
    console.log('responseCode: ', response.statusCode);

    if (response.statusCode === 200) {
      console.log("Successfully found npm package")
      process.exitCode = 0;
      return;
    } else if (retries > MAX_RETRIES) {
      console.log('Failed to find package on the npm registry');
      process.exitCode = 1;
      return;
    } else {
      retries++;
      console.log('sleeping for 5 seconds...');
      await sleep(POLL_INTERVAL_MS);
    }
  }
};

main();
