// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Link } from '@fluentui/react';
import React from 'react';

export const UnsupportedBrowserPage = (): JSX.Element => {
  window.document.title = 'Unsupported browser';
  return (
    <>
      <Link href="https://docs.microsoft.com//azure/communication-services/concepts/voice-video-calling/calling-sdk-features#calling-client-library-browser-support">
        Learn more
      </Link>
      &nbsp;about browsers and platforms supported by the web calling sdk
    </>
  );
};
