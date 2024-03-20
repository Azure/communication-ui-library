// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const emojiCache = new Map<string, Promise<string>>();

const getEmoji = (userId: string): Promise<string> => {
  const getTokenRequestOptions = {
    headers: { 'Content-Type': 'application/json' },
    method: 'GET'
  };
  return new Promise<string>((resolve) => {
    fetch('/userConfig/' + userId, getTokenRequestOptions)
      .then((data) => {
        return data.json();
      })
      .then((json) => {
        resolve(json.emoji);
      })
      .catch((error) => {
        console.error('Failed at getting emoji, Error: ', error);
        // Emoji defaults to '' if there was an error retrieving it from server.
        resolve('');
      });
  });
};

/**
 * Returns emoji string to caller based on userId. If emoji already exists in cache, return the cached emoji. Otherwise
 * makes a server request to get emoji. The returned emoji is a Promise<string> which may or may not be resolved so
 * caller should await it. There could potentially be many awaits happening so we may need to consider a callback style
 * approach.
 *
 * @param userId
 */
export const fetchEmojiForUser = (userId: string): Promise<string> => {
  const emoji = emojiCache.get(userId);
  if (emoji === undefined) {
    const promise: Promise<string> = getEmoji(userId);
    emojiCache.set(userId, promise);
    return promise;
  } else {
    return emoji;
  }
};
