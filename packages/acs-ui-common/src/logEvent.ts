// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureLogger } from '@azure/logger';

/**
 * @internal
 */
export type EventLevel = 'verbose' | 'info' | 'warning' | 'error';

/**
 * @internal
 */
export type TelemetryEvent = {
  name: string;
  message: string;
  level: EventLevel;
  data?: Record<string, unknown>;
};

/**
 * @internal
 * This is a log function to log structural data for easier parse in telemetry
 */
export const logEvent = (logger: AzureLogger, event: TelemetryEvent): void => {
  logger[event.level](logger, JSON.stringify(event));
};
