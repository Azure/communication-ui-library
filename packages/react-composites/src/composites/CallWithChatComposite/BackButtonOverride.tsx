// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect } from 'react';

/**
 * @private
 */
export const BackButtonOverride = (props: {
  /** This callback is executed when the browser back button is clicked with this component on the DOM tree */
  onBackButtonClick?: () => void;
}): JSX.Element => {
  useEffect(() => {
    if (props.onBackButtonClick) {
      const onBackButtonClick: () => void = props.onBackButtonClick;
      // This needs to be inside a setTimeout with no delay because newly event listeners added are executed immediately
      // from a previous popstate event
      setTimeout(() => window.addEventListener('popstate', onBackButtonClick));
    }
    return () => {
      if (props.onBackButtonClick) {
        const onBackButtonClick: () => void = props.onBackButtonClick;
        window.removeEventListener('popstate', onBackButtonClick);
      }
    };
  }, [props.onBackButtonClick]);

  return <></>;
};
