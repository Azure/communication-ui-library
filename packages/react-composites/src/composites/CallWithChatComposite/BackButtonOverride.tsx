// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useRef } from 'react';

/**
 * @private
 */
export const BackButtonOverride = (props: {
  /** This callback is only executed once and is intended for pushing states to the browser history */
  onInitialize?: () => void;
  /** This callback is executed when the browser back button is clicked with this component on the page */
  onBackButtonClick?: () => void;
}): JSX.Element => {
  const initialized = useRef(false);

  useEffect(() => {
    if (props.onInitialize && initialized.current === false) {
      initialized.current = true;
      props.onInitialize();
      console.log('BackButtonOverride initialized');
    }
    if (props.onBackButtonClick) {
      const onBackButtonClick: () => void = props.onBackButtonClick;
      // This needs to be inside a setTimeout with no delay because newly listeners added are executed immediately
      // from a previous popstate event
      setTimeout(() => window.addEventListener('popstate', onBackButtonClick));
    }
    return () => {
      if (props.onBackButtonClick) {
        const onBackButtonClick: () => void = props.onBackButtonClick;
        window.removeEventListener('popstate', onBackButtonClick);
      }
    };
  }, [props.onBackButtonClick, props.onInitialize]);

  return <></>;
};
