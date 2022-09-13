// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { _UnsupportedBrowser } from '@internal/react-components';
import React from 'react';
import { useLocale } from '../../../../react-components/src/localization';
import { SingleLineBetaBanner } from '../../BetaBanners/SingleLineBetaBanner';

const UnsupportedBrowserStory = (): JSX.Element => {
  const locale = useLocale().strings.UnsupportedBrowser;
  return (
    <Stack>
      <_UnsupportedBrowser
        strings={locale}
        onTroubleShootingClick={() => {
          alert('Clicked help link');
        }}
      />
    </Stack>
  );
};

const getDocs: () => JSX.Element = () => {
  return (
    <Stack>
      <SingleLineBetaBanner />
    </Stack>
  );
};
