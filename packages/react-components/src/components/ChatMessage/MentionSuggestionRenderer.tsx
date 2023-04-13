import React from 'react';
import { AtMentionSuggestion } from '../AtMentionFlyout';

/**
 * Provides the default implementation for rendering an Mention
 * @param suggestion - The suggestion to render
 *
 * @beta
 */
export const defaultMentionSuggestionRenderer = (suggestion: AtMentionSuggestion): JSX.Element => {
  return (
    <msft-at-mention
      userId={suggestion.userId}
      suggestionType={suggestion.suggestionType}
      displayName={suggestion.displayName}
    >
      {suggestion.displayName}
    </msft-at-mention>
  );
};

// TODO: move this to a common exported place.
// Add the custom HTML tag to the JSX.IntrinsicElements interface
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'msft-at-mention': React.HTMLAttributes<'msft-at-mention'> & {
        userId?: string;
        suggestionType?: string;
        displayName?: string;
      };
    }
  }
}
