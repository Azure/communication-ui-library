import React from 'react';
import { IButtonProps, Icon, Label, Stack } from '@fluentui/react';
import { EndCallButton } from '@azure/communication-react';

export const CustomEndCallButtonExample: () => JSX.Element = () => {
  const customOnRenderIcon = (): JSX.Element => {
    return <Icon key={'endCallCustomIconKey'} iconName={'DeclineCall'} style={{ color: 'black', fontSize: '25px' }} />;
  };

  const customOnRenderText = (props?: IButtonProps): JSX.Element => {
    return (
      <Label key={'endCallCustomLabelKey'} style={{ color: 'blue', fontStyle: 'italic' }}>
        end call
      </Label>
    );
  };

  return (
    <Stack horizontal horizontalAlign={'center'}>
      <EndCallButton
        style={{ backgroundColor: 'cyan' }}
        key={'endCallCustomBtnKey'}
        showLabel={true}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
      />
    </Stack>
  );
};
