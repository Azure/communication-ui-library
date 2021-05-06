import { CameraButton } from '@azure/communication-react';
import { IButtonProps, Icon, Label, Stack } from '@fluentui/react';
import React from 'react';

export const CustomCameraButtonExample: () => JSX.Element = () => {
  const customOnRenderIcon = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Icon iconName={'Camera'} style={{ color: 'green', fontSize: '25px' }} />;
    }

    return <Icon iconName={'Camera'} style={{ color: 'red', fontSize: '25px', fontWeight: 'bolder' }} />;
  };

  const customOnRenderText = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Label style={{ fontStyle: 'italic' }}>Turn off</Label>;
    }

    return <Label>Turn on</Label>;
  };

  return (
    <Stack horizontal horizontalAlign={'center'}>
      <CameraButton
        checked={true}
        showLabel={true}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
      />
      <CameraButton showLabel={true} onRenderIcon={customOnRenderIcon} onRenderText={customOnRenderText} />
    </Stack>
  );
};
