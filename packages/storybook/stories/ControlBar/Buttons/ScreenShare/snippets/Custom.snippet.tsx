import { ScreenShareButton } from '@azure/communication-react';
import { IButtonProps, Icon, Label } from '@fluentui/react';
import React from 'react';

export const CustomScreenShareButtonExample: () => JSX.Element = () => {
  const customOnRenderIcon = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Icon key={'screenShareIconKey'} iconName={'Presentation'} style={{ color: 'green', fontSize: '25px' }} />;
    }

    return (
      <Icon
        key={'screenShareIconKey'}
        iconName={'Presentation'}
        style={{ color: 'red', fontSize: '25px', fontWeight: 'bolder' }}
      />
    );
  };

  const customOnRenderText = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return (
        <Label key={'screenShareLabelKey'} style={{ fontStyle: 'italic' }}>
          sharing screen
        </Label>
      );
    }

    return <Label key={'screenShareLabelKey'}>not sharing screen</Label>;
  };

  return (
    <>
      <ScreenShareButton
        checked={true}
        showLabel={true}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
      />
      <ScreenShareButton showLabel={true} onRenderIcon={customOnRenderIcon} onRenderText={customOnRenderText} />
    </>
  );
};
