// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { useAdaptedSelector } from '../hooks/useAdaptedSelector';
import { useHandlers } from '../hooks/useHandlers';
import { LocalDeviceSettings } from '../components/LocalDeviceSettings';
import { StartCallButton } from '../components/StartCallButton';
import { devicePermissionSelector } from '../selectors/devicePermissionSelector';
import { useSelector } from '../hooks/useSelector';
import { DevicesButton, ErrorBar } from '@internal/react-components';
/* @conditional-compile-remove(call-readiness) */
import {
  DomainPermissions,
  _DrawerSurface,
  _DrawerSurfaceStyles,
  BrowserPermissionDenied as BrowserPermissionDeniedComponent
} from '@internal/react-components';
/* @conditional-compile-remove(rooms) */
import { _usePermissions, _Permissions } from '@internal/react-components';
import { getCallingSelector } from '@internal/calling-component-bindings';
import { Modal, Stack } from '@fluentui/react';
import { LocalPreview } from '../components/LocalPreview';
import {
  callDetailsStyleDesktop,
  callDetailsStyleMobile,
  configurationStackTokensDesktop,
  configurationStackTokensMobile,
  configurationContainerStyleDesktop,
  configurationContainerStyleMobile,
  selectionContainerStyle,
  startCallButtonContainerStyleDesktop,
  startCallButtonContainerStyleMobile,
  startCallButtonStyleMobile,
  titleContainerStyleDesktop,
  titleContainerStyleMobile,
  callDetailsContainerStylesDesktop
} from '../styles/CallConfiguration.styles';
import { useLocale } from '../../localization';
import { bannerNotificationStyles } from '../styles/CallPage.styles';
import { usePropsFor } from '../hooks/usePropsFor';
import { useAdapter } from '../adapter/CallAdapterProvider';
/* @conditional-compile-remove(call-readiness) */
import { DevicePermissionRestrictions } from '../CallComposite';

/**
 * @private
 */
export interface ConfigurationPageProps {
  mobileView: boolean;
  startCallHandler(): void;
  /* @conditional-compile-remove(call-readiness) */
  devicePermissions?: DevicePermissionRestrictions;
}

/**
 * @private
 */
export const ConfigurationPage = (props: ConfigurationPageProps): JSX.Element => {
  const { startCallHandler, mobileView, /* @conditional-compile-remove(call-readiness) */ devicePermissions } = props;

  const options = useAdaptedSelector(getCallingSelector(DevicesButton));
  const localDeviceSettingsHandlers = useHandlers(LocalDeviceSettings);
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useSelector(devicePermissionSelector);
  let errorBarProps = usePropsFor(ErrorBar);
  const adapter = useAdapter();
  const deviceState = adapter.getState().devices;

  let disableStartCallButton = !microphonePermissionGranted || deviceState.microphones?.length === 0;
  /* @conditional-compile-remove(rooms) */
  const rolePermissions = _usePermissions();

  /* @conditional-compile-remove(rooms) */
  // TODO: move this logic to the error bar selector once role is plumbed from the headless SDK
  if (!rolePermissions.cameraButton) {
    errorBarProps = {
      ...errorBarProps,
      activeErrorMessages: errorBarProps.activeErrorMessages.filter((e) => e.type !== 'callCameraAccessDenied')
    };
  }
  /* @conditional-compile-remove(rooms) */
  if (!rolePermissions.microphoneButton) {
    // If user's role permissions do not allow access to the microphone button then DO NOT disable the start call button
    // because microphone device permission is not needed for the user's role
    disableStartCallButton = false;
  }

  /* @conditional-compile-remove(call-readiness) */
  // Overrides role permissions if CallCompositeOptions devicePermissions are set
  if (devicePermissions) {
    if (
      ['doNotPrompt', 'optional'].includes(devicePermissions.camera) &&
      ['doNotPrompt', 'optional'].includes(devicePermissions.microphone)
    ) {
      disableStartCallButton = false;
    } else if (devicePermissions.camera === 'required') {
      disableStartCallButton = !cameraPermissionGranted || deviceState.cameras?.length === 0;
    }
  }

  const locale = useLocale();
  const title = (
    <Stack.Item className={mobileView ? titleContainerStyleMobile : titleContainerStyleDesktop}>
      {locale.strings.call.configurationPageTitle}
    </Stack.Item>
  );

  const callDescription = locale.strings.call.configurationPageCallDetails && (
    <Stack.Item className={mobileView ? callDetailsStyleMobile : callDetailsStyleDesktop}>
      {locale.strings.call.configurationPageCallDetails}
    </Stack.Item>
  );

  let mobileWithPreview = mobileView;
  /* @conditional-compile-remove(rooms) */
  mobileWithPreview = mobileWithPreview && rolePermissions.cameraButton;

  /* @conditional-compile-remove(call-readiness) */
  const [isDrawerShowing, setIsDrawerShowing] = useState(true);
  /* @conditional-compile-remove(call-readiness) */
  const [isModalShowing, setIsModalShowing] = useState(false);
  /* @conditional-compile-remove(call-readiness) */
  const onLightDismissTriggered = (): void => {
    // do nothing here
    // only way to dismiss this drawer is clicking on allow access which will leads to device permission prompt
  };
  /* @conditional-compile-remove(call-readiness) */
  const drawerStyle: _DrawerSurfaceStyles = {
    root: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      // apply zindex = 99 so drawer appear over device buttons and other components in the config page
      zIndex: 99
    }
  };

  /* @conditional-compile-remove(call-readiness) */
  const onClickEnableDevicePermission = (): void => {
    setIsModalShowing(true);
  };

  return (
    <Stack className={mobileView ? configurationContainerStyleMobile : configurationContainerStyleDesktop}>
      <Stack styles={bannerNotificationStyles}>
        <ErrorBar {...errorBarProps} />
      </Stack>

      {
        /* @conditional-compile-remove(call-readiness) */
        //show this when clicking on enable camera/mic button on desktop
        !mobileView && (!cameraPermissionGranted || !microphonePermissionGranted) && (
          <Modal
            isOpen={isModalShowing}
            isBlocking={false}
            onDismiss={() => {
              setIsModalShowing(false);
            }}
            overlay={{ styles: { root: { background: 'rgba(0,0,0,0.9)' } } }}
          >
            <DomainPermissions appName={'app'} onTroubleshootingClick={() => alert('clicked trouble shooting link')} />
          </Modal>
        )
      }

      {
        /* @conditional-compile-remove(call-readiness) */
        //show this for mobile
        mobileView && isDrawerShowing && (
          <_DrawerSurface onLightDismiss={onLightDismissTriggered} styles={drawerStyle}>
            <DomainPermissions
              appName={'app'}
              onTroubleshootingClick={() => console.log('clicked trouble shooting link')}
              onAllowAccessClick={async () => {
                await adapter.askDevicePermission({ video: true, audio: true });
                adapter.queryCameras();
                adapter.queryMicrophones();
                adapter.querySpeakers();
                setIsDrawerShowing(false);
              }}
            />
          </_DrawerSurface>
        )
      }
      <Stack
        grow
        horizontal={!mobileWithPreview}
        horizontalAlign={mobileWithPreview ? 'stretch' : 'center'}
        verticalAlign="center"
        tokens={mobileWithPreview ? configurationStackTokensMobile : configurationStackTokensDesktop}
      >
        {mobileWithPreview && (
          <Stack.Item>
            {title}
            {callDescription}
          </Stack.Item>
        )}
        {localPreviewTrampoline(
          mobileWithPreview,
          /* @conditional-compile-remove(rooms) */ !rolePermissions.cameraButton
        )}
        <Stack className={mobileView ? undefined : selectionContainerStyle}>
          {!mobileWithPreview && (
            <>
              <Stack.Item styles={callDetailsContainerStylesDesktop}>
                {title}
                {callDescription}
              </Stack.Item>
              <LocalDeviceSettings
                {...options}
                {...localDeviceSettingsHandlers}
                cameraPermissionGranted={cameraPermissionGranted}
                microphonePermissionGranted={microphonePermissionGranted}
                /* @conditional-compile-remove(call-readiness) */
                onClickEnableDevicePermission={onClickEnableDevicePermission}
              />
            </>
          )}
          <Stack
            styles={mobileWithPreview ? startCallButtonContainerStyleMobile : startCallButtonContainerStyleDesktop}
          >
            <StartCallButton
              className={mobileWithPreview ? startCallButtonStyleMobile : undefined}
              onClick={startCallHandler}
              disabled={disableStartCallButton}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

const localPreviewTrampoline = (mobileView: boolean, doNotShow?: boolean): JSX.Element | undefined => {
  /* @conditional-compile-remove(rooms) */
  if (doNotShow) {
    return undefined;
  }
  return <LocalPreview mobileView={mobileView} showDevicesButton={mobileView} />;
};
