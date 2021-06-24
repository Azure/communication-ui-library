// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const localStorageAvailable = typeof Storage !== 'undefined';

export enum LocalStorageKeys {
  DisplayName = 'DisplayName'
}

/**
 * Get display name from local storage.
 */
export const getDisplayNameFromLocalStorage = (): string | null =>
  window.localStorage.getItem(LocalStorageKeys.DisplayName);

/**
 * Save display name into local storage.
 */
export const saveDisplayNameToLocalStorage = (displayName: string): void =>
  window.localStorage.setItem(LocalStorageKeys.DisplayName, displayName);
