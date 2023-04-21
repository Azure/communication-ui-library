// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { Mention } from '../MentionFlyout';

/**
 * Provides the default implementation for rendering an Mention
 * @param suggestion - The suggestion to render
 *
 * @beta
 */
export const defaultMentionSuggestionRenderer = (suggestion: Mention): JSX.Element => {
  return (
    <msft-mention id={suggestion.id} displayText={suggestion.displayText}>
      {suggestion.displayText}
    </msft-mention>
  );
};

// Add the custom HTML tag to the JSX.IntrinsicElements interface
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'msft-mention': React.HTMLAttributes<'msft-mention'> & {
        id?: string;
        displayText?: string;
      };
    }
  }
}
