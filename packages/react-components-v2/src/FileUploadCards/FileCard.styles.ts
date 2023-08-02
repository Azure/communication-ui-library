// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { _pxToRem } from '@internal/acs-ui-common';

import { _FileCardProps } from './FileCard.types';

const defaultStack = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    width: 'auto',
    height: 'auto',
    boxSizing: 'border-box',
    '> *': {
      textOverflow: 'ellipsis'
    },
    '> :not(:first-child)': {
      marginTop: '0px'
    },
    '> *:not(.ms-StackItem)': {
      flexShrink: 1
    }
  }
});

/**
 * Styles for the {@link _FileCard}.
 *
 * @returns className
 *
 * @internal
 */
export const use_fileCardContainerStyles = makeStyles({
  actionItem: {
    justifyContent: 'center',
    cursor: 'pointer'
  },
  container: {
    ...defaultStack,
    width: '12rem',
    backgroundColor: tokens.colorNeutralBackground4,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border(_pxToRem(1), 'solid', tokens.colorNeutralBackground3Pressed),
    cursor: 'pointer',
    position: 'relative'
  },
  fileInfo: {
    ...shorthands.padding(_pxToRem(12)),
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between'
  },
  fileNameText: {
    ...shorthands.overflow('hidden'),
    boxSizing: 'border-box',
    lineHeight: 'normal',
    paddingRight: _pxToRem(4),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  progressBar: {
    ...shorthands.borderRadius(0, 0, tokens.borderRadiusMedium, tokens.borderRadiusMedium),
    bottom: 0,
    position: 'absolute'
  }
});
