// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getToken } from './getToken';

export const sendEmojiRequest = async (emoji: string): Promise<void> => {
  try {
    const postTokenRequestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Emoji: emoji })
    };
    await (
      await fetch('/userConfig/' + (await getToken()).identity, postTokenRequestOptions)
    ).json;
  } catch (error) {
    console.error('Failed at setting emoji, Error: ', error);
  }
};
