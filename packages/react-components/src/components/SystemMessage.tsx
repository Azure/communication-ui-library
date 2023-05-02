// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, FontIcon, mergeStyles, Stack, Text } from '@fluentui/react';
import React from 'react';
import { systemMessageIconStyle } from './styles/SystemMessage.styles';
import { ComponentSlotStyle } from '../types/ComponentSlotStyle';

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

  return (
    <Stack horizontal className={mergeStyles(props?.containerStyle as IStyle)} tabIndex={0}>
      {Icon}
      <Text style={{ wordBreak: 'break-word' }} role="status" title={content}>
        {content}
      </Text>
    </Stack>
  );
};
