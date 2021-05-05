import React from 'react';
import { IButtonProps, Icon, Label, Stack, Text } from '@fluentui/react';
import { ScreenShareButton } from '@azure/communication-ui';

export const CustomScreenShareButtonExample: () => JSX.Element = () => {
  const customOnRenderIcon = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Icon iconName={'Presentation'} style={{ color: 'green', fontSize: '25px' }} />;
    }

    return <Icon iconName={'Presentation'} style={{ color: 'red', fontSize: '25px', fontWeight: 'bolder' }} />;
  };

  const customOnRenderText = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Label style={{ fontStyle: 'italic' }}>sharing screen</Label>;
    }

    return <Label>not sharing screen</Label>;
  };

  return (
    <Stack horizontal horizontalAlign={'center'}>
      <ScreenShareButton
        checked={true}
        showLabel={true}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
      />
      <ScreenShareButton showLabel={true} onRenderIcon={customOnRenderIcon} onRenderText={customOnRenderText} />
    </Stack>
  );
};
