import { EndCallButton } from '@azure/communication-react';
import { Icon, Label } from '@fluentui/react';
import React from 'react';

export const EndCallButtonCustomExample: () => JSX.Element = () => {
  const customOnRenderIcon = (): JSX.Element => {
    return <Icon key={'endCallCustomIconKey'} iconName={'DeclineCall'} style={{ color: 'black', fontSize: '25px' }} />;
  };

  const customOnRenderText = (/*props?: IButtonProps*/): JSX.Element => {
    return (
      <Label key={'endCallCustomLabelKey'} style={{ color: 'blue', fontStyle: 'italic' }}>
        end call
      </Label>
    );
  };

  return (
    <EndCallButton
      style={{ background: 'cyan' }}
      key={'endCallCustomBtnKey'}
      showLabel={true}
      onRenderIcon={customOnRenderIcon}
      onRenderText={customOnRenderText}
    />
  );
};
