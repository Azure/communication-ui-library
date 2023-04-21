import { SendBox, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';
import { Mention } from '../../../../communication-react/dist/communication-react';

const suggestions: Mention[] = [
  {
    id: '1',
    displayText: ''
  },
  {
    id: '2',
    displayText: 'Patricia Adams'
  },
  {
    id: '3',
    displayText: '1'
  },
  {
    id: '4',
    displayText: 'Your user'
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
              return suggestion.displayText.toLocaleLowerCase().startsWith(query.toLocaleLowerCase());
            });
            return Promise.resolve(filtered);
          }
        }}
      />
    </div>
  </FluentThemeProvider>
);
