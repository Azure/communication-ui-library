// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useId } from '@fluentui/react-hooks';
import React, { useEffect } from 'react';

export const MobileWrapper = (props: { children: React.ReactNode }): JSX.Element => {
  const wrapperId = useId('mobilewrapper');

  useEffect(() => {
    const wrapper = document.getElementById(wrapperId);
    if (wrapper) {
      mobileWrap(wrapper);
    }
  }, [wrapperId]);

  return <div id={wrapperId}>{props.children}</div>;
};

const mobileWrap = (element: HTMLElement | null): void => {
  if (element) {
    element.addEventListener('mousedown', mouseHandler, true);
    element.addEventListener('mousemove', mouseHandler, true);
    element.addEventListener('mouseup', mouseHandler, true);
  }
};

const mouseHandler = (e): void => {
  e.preventDefault();
  const type = {
    mousedown: 'touchstart',
    mousemove: 'touchmove',
    mouseup: 'touchend',
    click: 'touchend'
  }[e.type];

  const touch = new Touch({
    identifier: e.button,
    clientX: e.clientX,
    clientY: e.clientY,
    screenX: e.screenX,
    screenY: e.screenY,
    target: e.target,
    touchType: 'direct'
  });
  const te = new TouchEvent(type, {
    bubbles: true,
    cancelable: true,
    touches: [touch],
    changedTouches: [touch],
    targetTouches: [touch]
  });
  e.target.dispatchEvent(te);
};
