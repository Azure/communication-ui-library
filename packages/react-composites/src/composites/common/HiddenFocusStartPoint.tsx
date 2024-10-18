// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DefaultButton, IStackStyles } from '@fluentui/react';
import React from 'react';
import { useEffect, useState } from 'react';

/**
 * @private
 *  hidden button to set first tab keypress focus on a specific grouping.
 *  On mount, button is autofocused then immediately hidden
 */
export const HiddenFocusStartPoint = (): JSX.Element => {
  const [isMounted, setIsMounted] = useState(false);
  // ariaHidden is used to hide the button from screen readers,
  // we want to only focus it for once then never again
  const [isUnfocused, setIsUnfocused] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <DefaultButton
      autoFocus
      onBlur={() => setIsUnfocused(true)}
      ariaHidden={isUnfocused}
      styles={isMounted ? invisibleHiddenFocusStartPoint : hiddenFocusStartPointStyles}
      tabIndex={-1}
    />
  );
};

/** @private */
const hiddenFocusStartPointStyles: IStackStyles = {
  root: {
    width: '0',
    height: '0',
    margin: '0',
    minHeight: '0',
    minWidth: '0',
    maxHeight: '0',
    maxWidth: '0',
    opacity: '0',
    outline: 'none',
    padding: '0',
    position: 'absolute'
  }
};

/** @private */
const invisibleHiddenFocusStartPoint: IStackStyles = {
  root: {
    display: 'none'
  }
};
