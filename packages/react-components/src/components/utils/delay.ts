// © Microsoft Corporation. All rights reserved.

export const delay = (delay: number): Promise<void> => {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
};
