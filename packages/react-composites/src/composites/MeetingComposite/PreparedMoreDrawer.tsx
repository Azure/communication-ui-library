// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { useCallWithChatCompositeStrings } from './hooks/useMeetingCompositeStrings';
import { MoreDrawer, MoreDrawerStrings } from './components/MoreDrawer';

/** @private */
export interface PreparedMoreDrawerProps {
  onLightDismiss: () => void;
  onPeopleButtonClicked: () => void;
}

/** @private */
export const PreparedMoreDrawer = (props: PreparedMoreDrawerProps): JSX.Element => {
  const strings = useCallWithChatCompositeStrings();
  const moreDrawerStrings: MoreDrawerStrings = useMemo(
    () => ({
      peopleButtonLabel: strings.peopleButtonLabel
    }),
    [strings]
  );
  return <MoreDrawer {...props} strings={moreDrawerStrings} />;
};
