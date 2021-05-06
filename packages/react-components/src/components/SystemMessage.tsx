// © Microsoft Corporation. All rights reserved.

import { IStyle, FontIcon, mergeStyles, Stack } from '@fluentui/react';
import { ComponentSlotStyle } from '@fluentui/react-northstar';
import React from 'react';
import { systemMessageContentStyle, systemMessageIconStyle } from './styles/SystemMessage.styles';

// Todo: We need to add more types of system messages that we support.
export type SystemMessageIconTypes = 'PeopleAdd' | 'PeopleBlock' | 'Edit';

export type SystemMessageProps = {
  /**
   * Icon name for the system message. iconName should match the iconName in fluentUI icon.
   */
  iconName: SystemMessageIconTypes;
  /**
   * Content string for the system message.
   */
  content: string;
  /*
   * Custom CSS Style for the system message container.
   */
  containerStyle?: ComponentSlotStyle;
};

export const SystemMessage = (props: SystemMessageProps): JSX.Element => {
  const { iconName, content } = props;
  const Icon: JSX.Element = <FontIcon iconName={iconName} className={mergeStyles(systemMessageIconStyle)} />;

  return (
    <Stack horizontal className={mergeStyles(props?.containerStyle as IStyle)}>
      {Icon}
      <span className={mergeStyles(systemMessageContentStyle)}>{content}</span>
    </Stack>
  );
};
