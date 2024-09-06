import { ControlBarButtonStyles, ScreenShareButton } from '@azure/communication-react';
import { IButtonProps, Icon, Label } from '@fluentui/react';
import React from 'react';

// Remove default height constraints to accomodate
// our more elaborate content.
const buttonStyles: ControlBarButtonStyles = {
  root: {
    height: 'none'
  },
  rootChecked: {
    height: 'none'
  }
};

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
        styles={buttonStyles}
      />
      <ScreenShareButton
        showLabel={true}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
        styles={buttonStyles}
      />
    </>
  );
};
