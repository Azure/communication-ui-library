import { Mention, SendBox, FluentThemeProvider } from '@azure/communication-react';
import React, { useEffect } from 'react';

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
    id: '5',
    displayText: 'Milton Dyer'
  },
  {
    id: '6',
    displayText: 'Ella Stewart'
  },
  {
    id: '7',
    displayText: 'Todd Nelson'
  },
  {
    id: '8',
    displayText: 'Bertie Holman'
  },
  {
    id: '9',
    displayText: 'Chloe Alvarez'
  },
  {
    id: '10',
    displayText: 'Hannah Gibson'
  },
  {
    id: '11',
    displayText: "Amelia O'Connor"
  },
  {
    id: '12',
    displayText: "Amelia O'Connor"
  },
  {
    id: '13',
    displayText: 'Imogen Morris'
  },
  {
    id: '14',
    displayText: 'Freya Hayes'
  },
  {
    id: '15',
    displayText: 'Ellie Collins'
  },
  {
    id: 'everyone',
    displayText: 'Everyone'
  }
];
const trigger = '@';

export const MentionsExample: () => JSX.Element = () => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const delayForSendButton = 300;

  useEffect(() => {
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <FluentThemeProvider>
      <div style={{ width: '31.25rem', marginTop: '15rem' }}>
        <SendBox
          onSendMessage={async (message) => {
            timeoutRef.current = setTimeout(() => {
              alert(`sent message: ${message} `);
            }, delayForSendButton);
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
};
