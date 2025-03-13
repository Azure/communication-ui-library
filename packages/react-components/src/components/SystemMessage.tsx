// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStyle, FontIcon, mergeStyles, Stack, Text } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { systemMessageIconStyle } from './styles/SystemMessage.styles';
import { ComponentSlotStyle } from '../types';
import LiveMessage from './Announcer/LiveMessage';

/**
 * Todo: We need to add more types of system messages that we support.
 *
 * @private
 */
export type SystemMessageIconTypes = 'PeopleAdd' | 'PeopleBlock' | 'Edit';

/**
 * @private
 */
export type SystemMessageProps = {
  /**
   * Icon name for the system message.
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

/**
 * @private
 */
export const SystemMessage = (props: SystemMessageProps): JSX.Element => {
  const { iconName, content } = props;
  const Icon: JSX.Element = <FontIcon iconName={iconName} className={mergeStyles(systemMessageIconStyle)} />;
  const [liveMessage, setLiveMessage] = useState('');

  useEffect(() => {
    // Timeout is needed to handle situation when the same user joins and leaves a chat a few times in a row, otherwise Narrator won't repeat the system message text.
    // Because delay value is not provided, setMessage function will be executed asynchronously in the next event cycle
    setTimeout(() => {
      setLiveMessage(content);
    });
  }, [content]);

  return (
    <>
      <LiveMessage message={liveMessage} ariaLive="polite" clearOnUnmount={true} />
      <Stack
        horizontal
        className={mergeStyles(props?.containerStyle as IStyle)}
        role="status"
        aria-label={content}
        tabIndex={0}
      >
        {Icon}
        <Text style={{ wordBreak: 'break-word' }} variant={'small'}>
          {content}
        </Text>
      </Stack>
    </>
  );
};
