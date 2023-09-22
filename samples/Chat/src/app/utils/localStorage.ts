// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export const localStorageAvailable = typeof Storage !== 'undefined';

export enum LocalStorageKeys {
  Theme = 'AzureCommunicationUI_Theme'
}

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
