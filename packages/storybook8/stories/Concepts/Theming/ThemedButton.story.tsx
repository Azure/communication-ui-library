// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { useTheme, CameraButton } from '@azure/communication-react';
import React from 'react';

export const ThemedButton = (): JSX.Element => {
  const theme = useTheme();

  const defaultButtonStyle = {
    root: {
      background: theme.palette.neutralLighter
    },
    rootHovered: {
      background: theme.palette.neutralLight
    }
  };
  return <CameraButton styles={defaultButtonStyle} />;
};
