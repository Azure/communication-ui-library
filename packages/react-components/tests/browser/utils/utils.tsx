// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 *  Helper function to detect whether a test is for a mobile broswer or not.
 *  TestInfo comes from the playwright config which gives different information about what platform the
 *  test is being run on.
 * */
export const isTestProfileMobile = (testProfileName: string): boolean => !isTestProfileDesktop(testProfileName);

/**
 *  Helper function to detect whether a test is for a mobile broswer or not.
 *  TestInfo comes from the playwright config which gives different information about what platform the
 *  test is being run on.
 * */
export const isTestProfileDesktop = (testProfileName: string): boolean => {
  const testName = testProfileName.toLowerCase();
  return testName.includes('desktop') ? true : false;
};
