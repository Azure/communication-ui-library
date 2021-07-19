import { ControlBarButton } from '@azure/communication-react';
import { IButtonProps, Icon, Label, Text } from '@fluentui/react';
import React from 'react';

export const CustomControlBarButtonExample: () => JSX.Element = () => {
  const customOnRenderIcon = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Icon key={'customIcon1'} iconName={'Airplane'} style={{ color: 'green', fontSize: '25px' }} />;
    }

    return (
      <Icon key={'customIcon2'} iconName={'Bus'} style={{ color: 'red', fontSize: '25px', fontWeight: 'bolder' }} />
    );
  };

  const customOnRenderText = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return (
        <Text key={'customText'} style={{ fontStyle: 'italic' }}>
          unmuted
        </Text>
      );
    }

    return <Label key={'customLabel'}>muted</Label>;
  };

  return (
    <>
      <ControlBarButton
        key={'customBtn1'}
        checked={true}
        showLabel={true}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
      />
      <ControlBarButton
        key={'customBtn2'}
        showLabel={true}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
      />
    </>
  );
};
