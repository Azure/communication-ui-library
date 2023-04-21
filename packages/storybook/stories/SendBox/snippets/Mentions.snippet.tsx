import { SendBox, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';
import { MentionSuggestion } from '../../../../communication-react/dist/communication-react';

const suggestions: MentionSuggestion[] = [
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
    <div style={{ width: '31.25rem', height: '20rem' }}>
      <div style={{ width: '31.25rem', height: '17rem' }} /> {/*Spacer for layout*/}
      <SendBox
        onSendMessage={async () => {
          return;
        }}
        onTyping={async () => {
          return;
        }}
        mentionLookupOptions={{
          trigger,
          onQueryUpdated: async (query: string) => {
            const filtered = suggestions.filter((suggestion) => {
              return suggestion.displayName.toLocaleLowerCase().startsWith(query.toLocaleLowerCase());
            });
            return Promise.resolve(filtered);
          }
        }}
      />
    </div>
  </FluentThemeProvider>
);
