import { SendBox, FluentThemeProvider } from '@azure/communication-react';
import { AtMentionSuggestion } from '../../../../communication-react/dist/communication-react';

import React from 'react';

const suggestions: AtMentionSuggestion[] = [
  {
    userId: '1',
    suggestionType: 'person',
    displayName: ''
  },
  {
    userId: '2',
    suggestionType: 'person',
    displayName: 'Patricia Adams'
  },
  {
    userId: '3',
    suggestionType: 'person',
    displayName: '1'
  },
  {
    userId: '4',
    suggestionType: 'person',
    displayName: 'Your user'
  }
];
const trigger = '@';

export const MentionsExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <SendBox
        onSendMessage={async () => {
          return;
        }}
        onTyping={async () => {
          return;
        }}
        atMentionLookupOptions={{
          trigger,
          onQueryUpdated: async (query: string) => {
            // Trigger is at the start currently, so remove it.
            const filterText = query.slice(trigger.length);
            const filtered = suggestions.filter((suggestion) => {
              return suggestion.displayName.toLocaleLowerCase().startsWith(filterText.toLocaleLowerCase());
            });
            return Promise.resolve(filtered);
          }
        }}
      />
    </div>
  </FluentThemeProvider>
);
