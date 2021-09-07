// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { initializeIcons, MessageBar } from '@fluentui/react';
import { ErrorBar } from './ErrorBar';
import Enzyme, { ShallowWrapper, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

describe('[xkcd] ErrorBar dismissal tests', () => {
  Enzyme.configure({ adapter: new Adapter() });
  initializeIcons();

  it('error with timestamp can be dimissed', () => {
    const root = mountErrorBarWithDefaults();
    root.setProps({
      activeErrors: [{ type: 'accessDenied', timestamp: new Date(Date.now()) }]
    });
    expect(messageBarCount(root)).toBe(1);
    dismissSingleErrors(root);
    expect(messageBarCount(root)).toBe(0);
  });
});

const mountErrorBarWithDefaults = (): ShallowWrapper => {
  return shallow(
    <ErrorBar
      activeErrors={[]}
      onDismissErrors={() => {
        /* deprecated */
      }}
    />
  );
};

const messageBarCount = (root: ShallowWrapper): number => {
  let count = 0;
  root.children().forEach((node: ShallowWrapper) => {
    if (node.is(MessageBar)) {
      count++;
    }
  });
  return count;
};

/**
 * Dismisses a MessageBar, when we know there is only one error being shown.
 */
const dismissSingleErrors = (root: ShallowWrapper) => {
  const onDismiss = root.find(MessageBar).prop('onDismiss');
  expect(onDismiss).toBeDefined();
  onDismiss && onDismiss();
};
