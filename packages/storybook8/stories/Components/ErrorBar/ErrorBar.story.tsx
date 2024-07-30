// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * THIS COMPONENT HAS BEEN REMOVED FROM @internal/react-compoNENTS PACKAGE.
 * AS SUCH THIS STORY HAS BEEN MARKED 'REMOVED' HOWEVER MAY BE RETURNED
 * WHEN THE COMPOSITE ERROR HANDLING STORY HAS BEEN COMPLETED.
 */

import { ErrorBar as ErrorBarComponent, useTheme } from '@azure/communication-react';
import { mergeStyles } from '@fluentui/react';
import React from 'react';

const ErrorBarStory = (args: any): JSX.Element => {
  const theme = useTheme();

  return (
    <div
      className={mergeStyles({
        background: theme.palette.neutralLighterAlt,
        padding: '2em',
        width: '75%',
        height: '50%'
      })}
    >
      <ErrorBarComponent
        activeErrorMessages={args.errorTypes.map((t: any) => ({ type: t, timestamp: new Date(Date.now()) }))}
      />
    </div>
  );
};

export const ErrorBar = ErrorBarStory.bind({});
