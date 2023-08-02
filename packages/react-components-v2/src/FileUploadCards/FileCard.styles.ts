// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { makeStyles, tokens } from '@fluentui/react-components';
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
    ...defaultStack,
    justifyContent: 'center',
    cursor: 'pointer'
  },
  container: {
    ...defaultStack,
    width: '12rem',
    boxSizing: 'border-box',
    '> *': {
      textOverflow: 'ellipsis'
    },
    '> :not(:first-child)': {
      marginTop: '0px'
    },
    '> *:not(.ms-StackItem)': {
      flexShrink: 1
    },
    backgroundColor: tokens.colorNeutralBackground2,
    // borderRadius: tokens.borderRadiusSmall,
    // border: `${_pxToRem(1)} solid ${theme.palette.neutralQuaternary}`,
    cursor: 'pointer'
  },
  fileInfo: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center'
    // padding: shorthands.padding(_pxToRem(12))
  },
  fileNameTextContainer: {
    ...defaultStack,
    paddingLeft: _pxToRem(4),
    minWidth: '75%',
    maxWidth: '75%'
  },
  fileNameText: {
    // overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 'normal',
    whiteSpace: 'nowrap',
    paddingRight: _pxToRem(4)
  }
});
