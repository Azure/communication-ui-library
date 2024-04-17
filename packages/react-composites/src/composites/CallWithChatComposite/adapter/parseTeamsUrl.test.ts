// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { getChatThreadFromTeamsLink } from './parseTeamsUrl';

describe('Get chat thread from teams link', () => {
  test('Should extract chat thread ID from teams url', async () => {
    expect(
      getChatThreadFromTeamsLink(
        'https://teams.microsoft.com/l/meetup-join/19:meeting_ZTgzM2VmZWEtMXExMC00Yzk3LWE5NjUtYzg5ZDM3OTRjMzk0@thread.v2/0?context=%7B%22Tid%22:%2272f108bf-86f1-41af-91ab-2d7cd011db47%22,%22Oid%22:%222708ac84-aa11-4fab-8d13-e8586a26f6cd%22%7D'
      )
    ).toEqual('19:meeting_ZTgzM2VmZWEtMXExMC00Yzk3LWE5NjUtYzg5ZDM3OTRjMzk0@thread.v2');
  });

  test('Should extract chat thread ID from teams url that has character encoding applied', async () => {
    expect(
      getChatThreadFromTeamsLink(
        'https://teams.microsoft.com/l/meetup-join/19%3ameeting_YzUyYzU5M2MtXzgyZC00YjIyLWJlMjItNmViY2RmMjY5MDM1%40thread.v2/0?context=%7b%22Tid%22%3a%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2c%22Oid%22%3a%2260a340bd-60fb-40a7-86ab-8ff107e06560%22%7d'
      )
    ).toEqual('19:meeting_YzUyYzU5M2MtXzgyZC00YjIyLWJlMjItNmViY2RmMjY5MDM1@thread.v2');
  });
});
