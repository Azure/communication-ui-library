import React from 'react';
import { IButtonProps, Icon, Label, Stack, Text } from '@fluentui/react';
import { CameraButton } from '@azure/communication-ui';

export const CustomCameraButtonExample: () => JSX.Element = () => {
  const customOnRenderIcon = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Icon key={'micCustomIcon1'} iconName={'Camera'} style={{ color: 'green', fontSize: '25px' }} />;
    }

    return (
      <Icon
        key={'micCustomIcon2'}
        iconName={'Camera'}
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
      <CameraButton
        key={'micCustomBtn1'}
        checked={true}
        showLabel={true}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
      />
      <CameraButton
        key={'micCustomBtn2'}
        showLabel={true}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
      />
    </Stack>
  );
};
