// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _isInCall } from '@internal/calling-component-bindings';
import { useCallback, useMemo, useState } from 'react';
import { callStatusSelector } from '../selectors/callStatusSelector';
import { useSelector } from './useSelector';

/**
 * Active tab option type for {@link CallPane} component
 * @private
 */
/** @beta */
export type CallSidePaneOption = null | 'people';

/**
 * @private
 */
export const useSidePaneState = (): {
  activePane: CallSidePaneOption;
  closePane: () => void;
  openPeoplePane: () => void;
  togglePeoplePane: () => void;
} => {
  const { callStatus } = useSelector(callStatusSelector);
  const isInCall = _isInCall(callStatus);
  const [chosenPane, setChosenPane] = useState<CallSidePaneOption>(null);

  const closePane = useCallback(() => {
    setChosenPane(null);
  }, [setChosenPane]);

  const openPeoplePane = useCallback(() => {
    setChosenPane('people');
  }, []);

  const togglePeoplePane = useCallback(() => {
    if (chosenPane === 'people') {
      closePane();
    } else {
      openPeoplePane();
    }
  }, [chosenPane, closePane, openPeoplePane]);

  // If we are not in a call, we should not show the people pane.
  const activePane: CallSidePaneOption = chosenPane === 'people' && isInCall ? 'people' : null;

  const memoizedReturnValue = useMemo(
    () => ({
      activePane,
      closePane,
      openPeoplePane,
      togglePeoplePane
    }),
    [activePane, closePane, openPeoplePane, togglePeoplePane]
  );

  return memoizedReturnValue;
};
