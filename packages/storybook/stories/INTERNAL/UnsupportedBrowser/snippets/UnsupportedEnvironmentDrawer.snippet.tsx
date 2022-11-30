// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import {
  _DrawerSurface,
  UnsupportedBrowser,
  UnsupportedBrowserVersion,
  UnsupportedOperatingSystem
} from '@internal/react-components';
import React, { useState } from 'react';
import {} from '../../../../../react-components/src/components/UnsupportedOperatingSystem';
import { useLocale } from '../../../../../react-components/src/localization';
import { MobilePreviewContainer } from '../../../MobileContainer';

export const UnsupportedEnvironmentDrawers: () => JSX.Element = () => {
  const unsupportedBrowserStrings = useLocale().strings.UnsupportedBrowser;
  const unsupportedBrowserVersionStrings = useLocale().strings.UnsupportedBrowserVersion;
  const unsupportedOperatingSystemStrings = useLocale().strings.UnsupportedOperatingSystem;
  const [unsupportedBrowserShowing, setUnsupportedBrowserShowing] = useState(false);
  const [unsupportedBrowserVersionShowing, setUnsupportedBrowserVersionShowing] = useState(false);
  const [unsupportedOperatingSystemShowing, setUnsupportedOperatingSystemShowing] = useState(false);
  const onLightDismissTriggeredUnsupportedBrowser = (): void => setUnsupportedBrowserShowing(false);
  const onLightDismissTriggeredUnsupportedBrowserVersion = (): void => setUnsupportedBrowserVersionShowing(false);
  const onLightDismissTriggeredUnsupportedOperatingSystem = (): void => setUnsupportedOperatingSystemShowing(false);
  return (
    <Stack horizontal wrap>
      <MobilePreviewContainer>
        {!unsupportedBrowserShowing && (
          <Stack
            styles={{ root: { cursor: 'pointer' } }}
            verticalFill
            verticalAlign="center"
            horizontalAlign="center"
            onClick={() => setUnsupportedBrowserShowing(true)}
          >
            Click to show drawer
          </Stack>
        )}
        {unsupportedBrowserShowing && (
          <_DrawerSurface onLightDismiss={onLightDismissTriggeredUnsupportedBrowser}>
            <UnsupportedBrowser
              onTroubleshootingClick={() => alert('clicked trouble shooting link')}
              strings={unsupportedBrowserStrings}
            />
          </_DrawerSurface>
        )}
      </MobilePreviewContainer>
      <MobilePreviewContainer>
        {!unsupportedBrowserVersionShowing && (
          <Stack
            styles={{ root: { cursor: 'pointer' } }}
            verticalFill
            verticalAlign="center"
            horizontalAlign="center"
            onClick={() => setUnsupportedBrowserVersionShowing(true)}
          >
            Click to show drawer
          </Stack>
        )}
        {unsupportedBrowserVersionShowing && (
          <_DrawerSurface onLightDismiss={onLightDismissTriggeredUnsupportedBrowserVersion}>
            <UnsupportedBrowserVersion
              onTroubleshootingClick={() => alert('clicked compatibility link')}
              strings={unsupportedBrowserVersionStrings}
            />
          </_DrawerSurface>
        )}
      </MobilePreviewContainer>
      <MobilePreviewContainer>
        {!unsupportedOperatingSystemShowing && (
          <Stack
            styles={{ root: { cursor: 'pointer' } }}
            verticalFill
            verticalAlign="center"
            horizontalAlign="center"
            onClick={() => setUnsupportedOperatingSystemShowing(true)}
          >
            Click to show drawer
          </Stack>
        )}
        {unsupportedOperatingSystemShowing && (
          <_DrawerSurface onLightDismiss={onLightDismissTriggeredUnsupportedOperatingSystem}>
            <UnsupportedOperatingSystem
              onTroubleshootingClick={() => alert('clicked compatibility link')}
              strings={unsupportedOperatingSystemStrings}
            />
          </_DrawerSurface>
        )}
      </MobilePreviewContainer>
    </Stack>
  );
};
