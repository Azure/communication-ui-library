import { CameraButton } from '@azure/communication-react';
import { IButtonProps, Icon, Label } from '@fluentui/react';
import React from 'react';

export const CustomCameraButtonExample: () => JSX.Element = () => {
  const customOnRenderIcon = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Icon key={'CameraIconKey'} iconName={'Camera'} style={{ color: 'green', fontSize: '25px' }} />;
    }

    return (
      <Icon
        key={'CameraIconKey'}
        iconName={'Camera'}
        style={{ color: 'red', fontSize: '25px', fontWeight: 'bolder' }}
      />
    );
  };

  const customOnRenderText = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return (
        <Label key={'CameraLabelKey'} style={{ fontStyle: 'italic' }}>
          Turn off
        </Label>
      );
    }

    return <Label key={'CameraLabelKey'}>Turn on</Label>;
  };

  return (
    <>
      <CameraButton
        key={'camera 1'}
        checked={true}
        showLabel={true}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
      />
      <CameraButton
        key={'camera 2'}
        showLabel={true}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
      />
    </>
  );
};
