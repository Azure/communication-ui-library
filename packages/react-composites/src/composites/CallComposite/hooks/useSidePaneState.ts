// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useCallback, useMemo, useState } from 'react';

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
  const [activePane, setActivePane] = useState<CallSidePaneOption>(null);

  const closePane = useCallback(() => {
    setActivePane(null);
  }, [setActivePane]);

  const openPeoplePane = useCallback(() => {
    setActivePane('people');
  }, []);

  const togglePeoplePane = useCallback(() => {
    if (activePane === 'people') {
      closePane();
    } else {
      openPeoplePane();
    }
  }, [activePane, closePane, openPeoplePane]);

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
