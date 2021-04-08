// © Microsoft Corporation. All rights reserved.

export const delay = async (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};
