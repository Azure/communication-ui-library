// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const localStorageAvailable = typeof Storage !== 'undefined';

export enum LocalStorageKeys {
  DisplayName = 'DisplayName',
  Theme = 'AzureCommunicationUI_Theme'
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

/**
 * Get theme from local storage.
 */
export const getThemeFromLocalStorage = (scopeId: string): string | null =>
  window.localStorage.getItem(LocalStorageKeys.Theme + '_' + scopeId);

/**
 * Save theme into local storage.
 */
export const saveThemeToLocalStorage = (theme: string, scopeId: string): void =>
  window.localStorage.setItem(LocalStorageKeys.Theme + '_' + scopeId, theme);
