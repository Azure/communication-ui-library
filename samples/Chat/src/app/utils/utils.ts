// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

declare let __BUILDTIME__: string; // Injected by webpack
declare let __CHATVERSION__: string; // Injected by webpack
declare let __COMMUNICATIONREACTVERSION__: string; //Injected by webpack
declare let __COMMITID__: string; //Injected by webpack

export const getChatSDKVersion = (): string => __CHATVERSION__;
export const getBuildTime = (): string => __BUILDTIME__;
export const getCommnicationReactSDKVersion = (): string => __COMMUNICATIONREACTVERSION__;
export const getCommitID = (): string => __COMMITID__;
export const CAT = '🐱';
export const MOUSE = '🐭';
export const KOALA = '🐨';
export const OCTOPUS = '🐙';
export const MONKEY = '🐵';
export const FOX = '🦊';

export const getBackgroundColor = (avatar: string): { backgroundColor: string } => {
  switch (avatar) {
    case CAT:
      return {
        backgroundColor: 'rgb(255, 250, 228)'
      };
    case MOUSE:
      return {
        backgroundColor: 'rgb(232, 242, 249)'
      };
    case KOALA:
      return {
        backgroundColor: 'rgb(237, 232, 230)'
      };
    case OCTOPUS:
      return {
        backgroundColor: 'rgb(255, 240, 245)'
      };
    case MONKEY:
      return {
        backgroundColor: 'rgb(255, 245, 222)'
      };
    case FOX:
      return {
        backgroundColor: 'rgb(255, 231, 205)'
      };
    default:
      return {
        backgroundColor: 'rgb(255, 250, 228)'
      };
  }
};

/**
 * Init React Render Tracker whenever it detects the query param 'rrt' is set to true.
 */
export const initReactRenderTracker = (): void => {
  const urlParams = new URLSearchParams(window.location.search);
  const isEnabled = urlParams.get('rrt');
  if (isEnabled !== 'true') {
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/react-render-tracker';
  document.head.appendChild(script);
};
