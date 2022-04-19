// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useRef } from 'react';

/**
 * @private
 */
export const BackButtonOverride = (props: {
  active: boolean;
  onClose: () => void;
  onInitialize: () => void;
  onBackButtonClickActive: () => void;
  onBackButtonClickInactive: () => void;
}): JSX.Element => {
  const statePushed = useRef(false);

  useEffect(() => {
    if (statePushed.current === false) {
      statePushed.current = true;
      props.onInitialize();
    }
    const h = () => {
      props.onBackButtonClickActive();
      props.onClose();
    };
    if (props.active) {
      window.removeEventListener('popstate', props.onBackButtonClickInactive);
      setTimeout(() => window.addEventListener('popstate', h));
    } else {
      window.removeEventListener('popstate', h);
      setTimeout(() => window.addEventListener('popstate', props.onBackButtonClickInactive));
    }
    return () => {
      window.removeEventListener('popstate', h);
      window.removeEventListener('popstate', props.onBackButtonClickInactive);
    };
  }, [props.active]);

  return <></>;
};
