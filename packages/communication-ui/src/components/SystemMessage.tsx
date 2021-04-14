// © Microsoft Corporation. All rights reserved.

import { mergeStyles, Stack } from '@fluentui/react';
import { ParticipantAddIcon, ParticipantRemoveIcon } from '@fluentui/react-northstar';
import React from 'react';
import { systemMessageContentStyle, systemMessageIconStyle } from './styles/SystemMessage.styles';

// Todo: We need to add more types of system messages that we support.
export type SystemMessageIconTypes = 'ParticipantAdded' | 'ParticipantRemoved';

export type SystemMessageProps = {
  iconName: SystemMessageIconTypes;
  content: string;
};

export const SystemMessage = (props: SystemMessageProps): JSX.Element => {
  const { iconName, content } = props;
  let Icon: JSX.Element | undefined = undefined;

  switch (iconName) {
    case 'ParticipantAdded': {
      Icon = <ParticipantAddIcon className={mergeStyles(systemMessageIconStyle)} />;
      break;
    }
    case 'ParticipantRemoved': {
      Icon = <ParticipantRemoveIcon className={mergeStyles(systemMessageIconStyle)} />;
      break;
    }
  }

  return (
    <Stack horizontal>
      {Icon}
      <span className={mergeStyles(systemMessageContentStyle)}>{content}</span>
    </Stack>
  );
};
