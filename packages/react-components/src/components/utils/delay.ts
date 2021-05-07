// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const delay = (delay: number): Promise<void> => {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
};
