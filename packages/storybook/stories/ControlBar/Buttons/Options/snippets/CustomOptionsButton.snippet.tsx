import React from 'react';
import { IButtonProps, Icon, Label, Stack } from '@fluentui/react';
import { OptionsButton } from 'react-components';

export const CustomOptionsButtonExample: () => JSX.Element = () => {
  const customOnRenderIcon = (): JSX.Element => {
    return (
      <Icon key={'optionsCustomIconKey'} iconName={'CircleAddition'} style={{ color: 'orange', fontSize: '20px' }} />
    );
  };

  const customOnRenderText = (props?: IButtonProps): JSX.Element => {
    return (
      <Label key={'optionsCustomLabelKey'} style={{ color: 'darkviolet', fontStyle: 'italic' }}>
        More
      </Label>
    );
  };

  return (
    <Stack horizontal horizontalAlign={'center'}>
      <OptionsButton
        key={'optionsCustomBtnKey'}
        showLabel={true}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
      />
    </Stack>
  );
};
