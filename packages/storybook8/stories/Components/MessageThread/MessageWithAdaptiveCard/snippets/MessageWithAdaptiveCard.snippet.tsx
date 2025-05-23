import { MessageProps, MessageRenderer, MessageThread } from '@azure/communication-react';
import { Action } from 'adaptivecards';
import { AdaptiveCard } from 'adaptivecards-react';
import React, { useCallback } from 'react';
import { GetHistoryWithAdaptiveCardMessages } from '../../snippets/placeholdermessages';

export const MessageThreadWithAdaptiveCardExample: () => JSX.Element = () => {
  const adaptiveCardMessageStyles = React.useMemo(
    () => ({
      border: '1px solid black',
      borderRadius: '5px',
      marginRight: '20px'
    }),
    []
  );

  const onRenderMessage = useCallback(
    (messageProps: MessageProps, defaultOnRender?: MessageRenderer): JSX.Element => {
      if (messageProps.message.messageType !== 'custom') {
        return defaultOnRender ? defaultOnRender(messageProps) : <></>;
      }
      try {
        // host config setup
        const hostConfig = { fontFamily: 'Times New Roman' };
        // parse the adaptive card from the message content
        const adaptiveCard = JSON.parse(messageProps.message.content);

        return (
          <AdaptiveCard
            payload={adaptiveCard}
            hostConfig={hostConfig}
            onExecuteAction={(action: Action) => console.log('onExecuteAction', action)}
            onActionOpenUrl={(action: Action) => {
              console.log('onActionOpenUrl', action);
            }}
            onActionShowCard={(action: Action) => console.log('onActionShowCard', action)}
            onError={(error: any) => console.log('onError', error)}
            style={adaptiveCardMessageStyles}
          />
        );
      } catch (error) {
        console.log('adaptive card error', messageProps.message, error);
        // use default render in case if adaptive cards can't be parsed
        return defaultOnRender ? defaultOnRender(messageProps) : <></>;
      }
    },
    [adaptiveCardMessageStyles]
  );

  return (
    <MessageThread userId={'1'} messages={GetHistoryWithAdaptiveCardMessages()} onRenderMessage={onRenderMessage} />
  );
};
