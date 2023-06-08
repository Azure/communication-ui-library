import { Mention, SendBox, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

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
  },
  {
    id: 'everyone',
    displayText: 'Everyone'
  }
];
const trigger = '@';

export const MentionsExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem', height: '20rem' }}>
      <div style={{ width: '31.25rem', height: '17rem' }} /> {/*Spacer for layout*/}
      <SendBox
        onSendMessage={async (message) => alert(`sent message: ${message} `)}
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
