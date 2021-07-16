// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient } from '@azure/communication-chat';
import { chromium, Browser, Page } from 'playwright';
import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
import { PARTICIPANT_NAMES } from '../config';
import { startServer, stopServer } from './app/server';
import { test as base } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

export interface ChatWorkerFixtures {
  serverUrl: string;
  testBrowser: Browser;
  participants: string[];
  pages: Array<Page>;
}

/**
 * A worker-scoped test fixture for ChatComposite browser tests.
 */
export const test = base.extend<unknown, ChatWorkerFixtures>({
  /**
   * Run a server to serve the ChatComposite example app.
   *
   * @returns string URL for the server.
   */
  serverUrl: [
    // playwright forces us to use a destructuring pattern for first argument.
    /* eslint-disable-next-line no-empty-pattern */
    async ({}, use) => {
      await startServer();
      try {
        await use(SERVER_URL);
      } finally {
        await stopServer();
      }
    },
    { scope: 'worker' }
  ],
  /**
   * Starts a test browser to load the ChatComposite example app.
   *
   * @returns Browser object.
   */
  testBrowser: [
    // playwright forces us to use a destructuring pattern for first argument.
    /* eslint-disable-next-line no-empty-pattern */
    async ({}, use) => {
      const browser = await chromium.launch({
        args: ['--start-maximized', '--disable-features=site-per-process'],
        headless: true
      });
      try {
        await use(browser);
      } finally {
        await browser.close();
      }
    },
    { scope: 'worker' }
  ],
  /**
   * Returns a list of chat thread participants for the test.
   */
  participants: [
    // playwright forces us to use a destructuring pattern for first argument.
    /* eslint-disable-next-line no-empty-pattern */
    async ({}, use) => {
      await use(PARTICIPANT_NAMES.slice(0, MAX_PARTICIPANTS));
    },
    { scope: 'worker' }
  ],
  /**
   * Loads the ChatComposite example app for each participant in a browser page.
   *
   * @returns Array of Page's loaded, one for each participant.
   */
  pages: [
    async ({ serverUrl, participants, testBrowser }, use) => {
      const users = await createUserAndThread(CONNECTION_STRING, TOPIC_NAME, participants);
      const pages = await Promise.all(
        users.map(async (user) => {
          const qs = encodeQueryData(user);
          const page = await testBrowser.newPage();
          await page.setViewportSize(PAGE_VIEWPORT);
          await page.goto(`${serverUrl}?${qs}`, { waitUntil: 'networkidle' });
          // Important: For ensuring that blinking cursor doesn't get captured in
          // snapshots and cause a diff in subsequent tests.
          page.addStyleTag({ content: `* { caret-color: transparent !important; }` });
          return page;
        })
      );
      await use(pages);
    },
    { scope: 'worker' }
  ]
});

const CONNECTION_STRING = process.env.CONNECTION_STRING ?? '';
const TOPIC_NAME = 'Cowabunga';

const SERVER_URL = 'http://localhost:3000';

const PAGE_VIEWPORT = {
  width: 1200,
  height: 768
};

const MAX_PARTICIPANTS = 2;

type IdentityType = {
  userId: string;
  token: string;
  endpointUrl: string;
  displayName: string;
  threadId: string;
  topic: string;
};

const createUserAndThread = async (
  resourceConnectionString: string,
  topic: string,
  displayNames: string[]
): Promise<Array<IdentityType>> => {
  const endpointUrl = new URL(resourceConnectionString.replace('endpoint=', '').split(';')[0]).toString();
  const tokenClient = new CommunicationIdentityClient(resourceConnectionString);
  const userAndTokens: CommunicationUserToken[] = [];
  for (let i = 0; i < displayNames.length; i++) {
    userAndTokens.push(await tokenClient.createUserAndToken(['chat']));
  }

  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAndTokens[0].token));
  const threadId = (await chatClient.createChatThread({ topic: topic })).chatThread?.id ?? '';
  await chatClient.getChatThreadClient(threadId).addParticipants({
    participants: displayNames.map((displayName, i) => ({ id: userAndTokens[i].user, displayName: displayName }))
  });

  return displayNames.map((displayName, i) => ({
    userId: userAndTokens[i].user.communicationUserId,
    token: userAndTokens[i].token,
    endpointUrl,
    displayName,
    threadId,
    topic
  }));
};

const encodeQueryData = (data: IdentityType): string => {
  const qs: Array<string> = [];
  for (const d in data) {
    qs.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  }
  return qs.join('&');
};
