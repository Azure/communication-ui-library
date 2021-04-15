// © Microsoft Corporation. All rights reserved.

import { FontIcon, mergeStyles, Stack } from '@fluentui/react';
// import { EditIcon, ParticipantAddIcon, ParticipantRemoveIcon } from '@fluentui/react-northstar';
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
};

export const SystemMessage = (props: SystemMessageProps): JSX.Element => {
  const { iconName, content } = props;
  const Icon: JSX.Element = <FontIcon iconName={iconName} className={mergeStyles(systemMessageIconStyle)} />;

  return (
    <Stack horizontal>
      {Icon}
      <span className={mergeStyles(systemMessageContentStyle)}>{content}</span>
    </Stack>
  );
};
