// © Microsoft Corporation. All rights reserved.

import { mergeStyles, Stack } from '@fluentui/react';
import { ParticipantAddIcon, ParticipantRemoveIcon } from '@fluentui/react-northstar';
import React from 'react';
import { SystemMessageTypes } from '../types';
import { systemMessageContentStyle, systemMessageIconStyle } from './styles/SystemMessage.styles';

export type SystemMessageProps = {
  type: SystemMessageTypes;
  content: string;
};

export const SystemMessage = (props: SystemMessageProps) => {
  const { type, content } = props;
  let Icon: JSX.Element | undefined = undefined;

  switch (type) {
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
