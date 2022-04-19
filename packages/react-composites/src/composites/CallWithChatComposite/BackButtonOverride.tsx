// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useRef } from 'react';

/**
 * @private
 */
export const BackButtonOverride = (props: { onInitialize: () => void; onBackButtonClick: () => void }): JSX.Element => {
  const statePushed = useRef(false);

  useEffect(() => {
    if (statePushed.current === false) {
      statePushed.current = true;
      props.onInitialize();
    }
    setTimeout(() => window.addEventListener('popstate', props.onBackButtonClick));
    return () => {
      window.removeEventListener('popstate', props.onBackButtonClick);
    };
  }, [props.onBackButtonClick, props.onInitialize]);

  return <></>;
};
