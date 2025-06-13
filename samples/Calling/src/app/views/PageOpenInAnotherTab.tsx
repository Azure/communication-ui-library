// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Link } from '@fluentui/react';
import React from 'react';
import { NoticePage } from './NoticePage';
/**
 * PageOpenInAnotherTab component renders a notice page indicating that the app is already open in another tab.
 * @returns A JSX element that renders a notice page indicating that the app is already open in another tab.
 */
export const PageOpenInAnotherTab = (): JSX.Element => {
  window.document.title = 'App already open in another tab';
  return (
    <NoticePage
      title="App is already open in another tab"
      moreDetails={
        <>
          On mobile browsers, Azure Communication Services only supports one active call at a time. For more information
          see:{' '}
          <Link
            href="https://docs.microsoft.com/en-us/azure/communication-services/concepts/best-practices#handling-multiple-calls-on-multiple-tabs-on-mobile"
            target="_blank"
          >
            Calling SDK Best Practices
          </Link>
          .
        </>
      }
      icon="⚠️"
    />
  );
};
