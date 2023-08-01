// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { makeStyles, mergeClasses } from '@fluentui/react-components';
import { _pxToRem } from '@internal/acs-ui-common';
import { _FileCardGroupProps } from './FileCardGroup.types';

const useRootStyles = makeStyles({
  root: {
    display: 'row wrap',
    /**
     * margin for children is overridden by parent stack, so adding left margin for each child
     */
    '& > *:not(:first-child)': {
      marginLeft: _pxToRem(2)
    }
  }
});

/**
 * Note: If we use stack tokens.childrenGap, when child elements are wrapped and moved to the next line,
 * an extra margin is added to the left of each line.
 * This is a workaround to avoid this issue.
 * @internal
 */
export const _fileCardGroupClassName = (props: _FileCardGroupProps): string => {
  const internalStyles = useRootStyles();
  return mergeClasses(internalStyles.root, props.className);
};
