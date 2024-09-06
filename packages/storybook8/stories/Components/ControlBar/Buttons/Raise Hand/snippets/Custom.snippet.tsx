import { ControlBarButtonStyles, RaiseHandButton } from '@azure/communication-react';
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

export const CustomRaiseHandButtonExample: () => JSX.Element = () => {
  const customOnRenderIcon = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Icon key={'raiseHandLabelKey'} iconName={'Presentation'} style={{ color: 'green', fontSize: '25px' }} />;
    }

    return (
      <Icon
        key={'raiseHandLabelKey'}
        iconName={'Presentation'}
        style={{ color: 'red', fontSize: '25px', fontWeight: 'bolder' }}
      />
    );
  };

  const customOnRenderText = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return (
        <Label key={'raiseHandLabelKey'} style={{ fontStyle: 'italic' }}>
          Raise My Hand
        </Label>
      );
    }

    return <Label key={'raiseHandLabelKey'}>Lower My Hand</Label>;
  };

  return (
    <>
      <RaiseHandButton
        checked={true}
        showLabel={true}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
        styles={buttonStyles}
      />
      <RaiseHandButton
        showLabel={true}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
        styles={buttonStyles}
      />
    </>
  );
};
