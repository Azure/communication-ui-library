// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Link } from '@fluentui/react';
import React from 'react';
import { NoticePage } from './NoticePage';
/**
 * UnsupportedBrowserPage component renders a notice page indicating that the browser is unsupported.
 * @returns A JSX element that renders a notice page indicating that the browser is unsupported.
 */
export const UnsupportedBrowserPage = (): JSX.Element => {
  window.document.title = 'Unsupported browser';
  return (
    <NoticePage
      title="Unsupported Browser"
      moreDetails={
        <>
          <Link
            href="https://docs.microsoft.com/azure/communication-services/concepts/voice-video-calling/calling-sdk-features#calling-client-library-browser-support"
            target="_blank"
          >
            Learn more
          </Link>{' '}
          about browsers and platforms supported by the web calling sdk.
        </>
      }
      icon="⚠️"
    />
  );
};
