// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ControlBar, CameraButton, CameraButtonProps } from '@internal/react-components';
import { useCallingPropsFor } from '@internal/calling-component-bindings';
import React from 'react';

/**
 * return calling components.
 *
 * @internal
 */
export const StatefulComponents = (): JSX.Element => {
  //   const call = useCall();
  // const startCaptionsButtonProps = usePropsFor(StartCaptionsButton);
  // const captionsSettingsModalProps = usePropsFor(CaptionsSettingsModal);
  // const captionsBannerProps = usePropsFor(CaptionsBanner);
  // const [showRealTimeTextModal, setShowRealTimeTextModal] = useState(false);
  // const [isRealTimeTextStarted, setIsRealTimeTextStarted] = useState(false);
  // const [showCaptionsSettingsModal, setShowCaptionsSettingsModal] =
  //   useState(false);

  //   console.log("captionsBannerProps", captionsBannerProps);
  //   console.log("captionsSettingsModalProps", captionsSettingsModalProps);
  //   console.log("startCaptionsButtonProps", startCaptionsButtonProps);
  //   console.log("showRealTimeTextModal", showRealTimeTextModal);
  //   console.log("isRealTimeTextStarted", isRealTimeTextStarted);
  //   console.log("showCaptionsSettingsModal", showCaptionsSettingsModal);
  //   console.log("call", call);

  const cameraProps: CameraButtonProps | undefined = useCallingPropsFor(CameraButton);
  console.log('cameraProps', cameraProps);
  return (
    <ControlBar layout="floatingBottom">
      {cameraProps && <CameraButton {...(cameraProps as CameraButtonProps)} />}
    </ControlBar>
    // <Stack className={mergeStyles({ height: "100%" })}>
    //   {captionsSettingsModalProps?.isCaptionsFeatureActive && (
    //     <CaptionsSettingsModal
    //       {...captionsSettingsModalProps}
    //       showModal={showCaptionsSettingsModal}
    //       onDismissCaptionsSettings={() => {
    //         setShowCaptionsSettingsModal(false);
    //       }}
    //     />
    //   )}
    //   {
    //     /* @conditional-compile-remove(rtt) */ showRealTimeTextModal && (
    //       <RealTimeTextModal
    //         showModal={showRealTimeTextModal}
    //         onDismissModal={() => {
    //           setShowRealTimeTextModal(false);
    //         }}
    //         onStartRealTimeText={() => {
    //           setIsRealTimeTextStarted(true);
    //         }}
    //       />
    //     )
    //   }
    //   {(captionsBannerProps?.isCaptionsOn ||
    //     /* @conditional-compile-remove(rtt) */ captionsBannerProps.isRealTimeTextOn ||
    //     /* @conditional-compile-remove(rtt) */ isRealTimeTextStarted) && (
    //     <CaptionsBanner
    //       {...captionsBannerProps}
    //       /* @conditional-compile-remove(rtt) */
    //       isRealTimeTextOn={
    //         captionsBannerProps.isRealTimeTextOn || isRealTimeTextStarted
    //       }
    //     />
    //   )}

    //   {startCaptionsButtonProps && (
    //     <StartCaptionsButton
    //       {...startCaptionsButtonProps}
    //       disabled={!(call?.state === "Connected")}
    //       onStartCaptions={async () => {
    //         setShowCaptionsSettingsModal(true);
    //         startCaptionsButtonProps.onStartCaptions();
    //       }}
    //     />
    //   )}
    //   {startCaptionsButtonProps && (
    //     <ControlBarButton
    //       onRenderOnIcon={() => <LocalLanguage20Regular />}
    //       onRenderOffIcon={() => <LocalLanguage20Regular />}
    //       disabled={!captionsSettingsModalProps.isCaptionsFeatureActive}
    //       onClick={() => {
    //         setShowCaptionsSettingsModal(true);
    //       }}
    //     />
    //   )}
    //   {
    //     <StartRealTimeTextButton
    //       disabled={!(call?.state === "Connected")}
    //       isRealTimeTextOn={
    //         captionsBannerProps.isRealTimeTextOn || isRealTimeTextStarted
    //       }
    //       onStartRealTimeText={() => {
    //         setShowRealTimeTextModal(true);
    //       }}
    //     />
    //   }
    // </Stack>
  );
};

export default StatefulComponents;
