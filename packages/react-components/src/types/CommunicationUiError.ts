// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Severity is a rating provided by UI on the impact of the error. It can be used as a rough metric for decision making.
 * If using ErrorBar component, a INFO, WARNING, or ERROR severity will cause the message to be displayed in ErrorBar.
 */
export type CommunicationUiErrorSeverity = 'info' | 'warning' | 'error' | 'ignore';
