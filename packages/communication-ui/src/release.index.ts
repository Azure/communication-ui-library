// © Microsoft Corporation. All rights reserved.

/**
 * This file exists only while we ready the api for review and refactor out code.
 * This will replace index.ts once that work is complete.
 * Do not forget to update the `types` in the package.json when this is complete to
 * `dist/communication-ui.d.ts`.
 */

export * from './components';
export * from './constants/themes';
export * from './providers/FluentThemeProvider';
export * from './providers/SwitchableFluentThemeProvider';

export type {
  BaseCustomStylesProps,
  CommunicationUiErrorSeverity,
  MessageAttachedStatus,
  MessageStatus,
  TypingUser,
  Message,
  MessageTypes,
  ChatMessage,
  SystemMessage,
  CustomMessage,
  SystemMessagePayload,
  ChatMessagePayload
} from './types';
