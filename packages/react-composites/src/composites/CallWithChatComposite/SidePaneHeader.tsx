// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CommandBarButton, Stack } from '@fluentui/react';
import { useTheme } from '@internal/react-components';
import React, { useMemo } from 'react';
import { sidePaneHeaderStyles } from '../common/styles/ParticipantContainer.styles';

/**
 * @private
 */
export const SidePaneHeader = (props: { headingText: string; onClose: () => void }): JSX.Element => {
  const theme = useTheme();
  const sidePaneCloseButtonStyles = useMemo(
    () => ({
      root: { minWidth: '1.5rem', padding: 0 },
      icon: { color: theme.palette.neutralSecondary },
      iconHovered: { color: theme.palette.neutralSecondary },
      iconPressed: { color: theme.palette.neutralSecondary }
    }),
    [theme.palette.neutralSecondary]
  );
  return (
    <Stack horizontal horizontalAlign="space-between">
      <Stack.Item styles={sidePaneHeaderStyles}>{props.headingText}</Stack.Item>
      <CommandBarButton styles={sidePaneCloseButtonStyles} iconProps={{ iconName: 'cancel' }} onClick={props.onClose} />
    </Stack>
  );
};
