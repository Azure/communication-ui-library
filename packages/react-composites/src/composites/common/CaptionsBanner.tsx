// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useState } from 'react';
import { _CaptionsBanner } from '@internal/react-components';
import { _DrawerMenu, _DrawerMenuItemProps, _DrawerSurface } from '@internal/react-components';
import { mergeStyles, Stack } from '@fluentui/react';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
import { CaptionsSettingModal } from './CaptionsSettingModal';
import { CaptionsBannerMoreButton } from './CaptionsBannerMoreButton';

/** @private */
export const CaptionsBanner = (props: { isMobile: boolean }): JSX.Element => {
  const captionsBannerProps = usePropsFor(_CaptionsBanner);
  const [isCaptionsSettingOpen, setIsCaptionsSettingOpen] = useState<boolean>(false);
  const onClickCaptionsSettings = (): void => {
    setIsCaptionsSettingOpen(true);
  };

  const onDismissCaptionsSetting = (): void => {
    setIsCaptionsSettingOpen(false);
  };

  const containerClassName = mergeStyles({
    position: 'relative'
  });

  const floatingChildClassName = mergeStyles({
    position: 'absolute',
    right: 0,
    top: 0
  });

  return (
    <>
      {isCaptionsSettingOpen && (
        <CaptionsSettingModal
          showCaptionsSettingModal={isCaptionsSettingOpen}
          onDismissCaptionsSetting={onDismissCaptionsSetting}
        />
      )}
      {captionsBannerProps.captions.length > 0 && captionsBannerProps.isCaptionsOn && (
        <div className={containerClassName}>
          <Stack horizontalAlign="center">
            <Stack.Item style={{ width: props.isMobile ? '90%' : '50%' }}>
              <_CaptionsBanner {...captionsBannerProps} />
            </Stack.Item>
          </Stack>
          {!props.isMobile && (
            <div className={floatingChildClassName}>
              <CaptionsBannerMoreButton onCaptionsSettingsClick={onClickCaptionsSettings} />
            </div>
          )}
        </div>
      )}
    </>
  );
};
