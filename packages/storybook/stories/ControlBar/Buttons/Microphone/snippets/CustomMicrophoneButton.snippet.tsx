import React from 'react';
import { IButtonProps, Icon, Label, Stack, Text } from '@fluentui/react';
import { MicrophoneButton } from '@azure/communication-react';

export const CustomMicrophoneButtonExample: () => JSX.Element = () => {
  const customOnRenderIcon = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Icon key={'micCustomIcon1'} iconName={'Microphone'} style={{ color: 'green', fontSize: '25px' }} />;
    }

    return (
      <Icon
        key={'micCustomIcon2'}
        iconName={'Microphone'}
        style={{ color: 'red', fontSize: '25px', fontWeight: 'bolder' }}
      />
    );
  };

  const customOnRenderText = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return (
        <Text key={'micCustomText'} style={{ fontStyle: 'italic' }}>
          unmuted
        </Text>
      );
    }

    return <Label key={'micCustomLabel'}>muted</Label>;
  };

  return (
    <Stack horizontal horizontalAlign={'center'}>
      <MicrophoneButton
        key={'micCustomBtn1'}
        checked={true}
        showLabel={true}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
      />
      <MicrophoneButton
        key={'micCustomBtn2'}
        showLabel={true}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
      />
    </Stack>
  );
};
