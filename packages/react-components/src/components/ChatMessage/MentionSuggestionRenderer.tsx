// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { MentionSuggestion } from '../MentionFlyout';

/**
 * Provides the default implementation for rendering an Mention
 * @param suggestion - The suggestion to render
 *
 * @beta
 */
export const defaultMentionSuggestionRenderer = (suggestion: MentionSuggestion): JSX.Element => {
  return (
    <msft-mention
      userId={suggestion.userId}
      suggestionType={suggestion.suggestionType}
      displayName={suggestion.displayName}
    >
      {suggestion.displayName}
    </msft-mention>
  );
};

// Add the custom HTML tag to the JSX.IntrinsicElements interface
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'msft-mention': React.HTMLAttributes<'msft-mention'> & {
        userId?: string;
        suggestionType?: string;
        displayName?: string;
      };
    }
  }
}
