// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ActiveErrorMessage, Dialpad, DtmfTone, ErrorBar } from '@internal/react-components';
import { MobileChatSidePaneTabHeaderProps } from '../../common/TabHeader';
import { CallCompositeOptions } from '../CallComposite';
import { SidePaneRenderer } from '../components/SidePane/SidePaneProvider';
import { CapabilitiesChangeNotificationBarProps } from '../components/CapabilitiesChangedNotificationBar';
import { usePropsFor } from '../hooks/usePropsFor';
import { useLocale } from '../../localization';
import { disableCallControls, reduceCallControlsForMobile } from '../utils';
import React, { useRef, useState } from 'react';
import { useAdapter } from '../adapter/CallAdapterProvider';
import { CallArrangement } from '../components/CallArrangement';
import { CommonCallAdapter } from '../adapter';
import { Stack, Text, useTheme } from '@fluentui/react';
import { getReadableTime } from '../utils/timerUtils';
import { DtmfDialpadContentTimerStyles } from '../styles/DtmfDialpadPage.styles';

/**
 * @internal
 */
export interface DialpadPageProps {
  mobileView: boolean;
  options?: CallCompositeOptions;
  modalLayerHostId: string;
  updateSidePaneRenderer: (renderer: SidePaneRenderer | undefined) => void;
  mobileChatTabHeader?: MobileChatSidePaneTabHeaderProps;
  latestErrors: ActiveErrorMessage[];
  onDismissError: (error: ActiveErrorMessage) => void;
  /* @conditional-compile-remove(capabilities) */
  capabilitiesChangedNotificationBarProps?: CapabilitiesChangeNotificationBarProps;
  onSetDialpadPage: () => void;
}

interface DialpadPageContentProps {
  mobileView: boolean;
  adapter: CommonCallAdapter;
}

const DtmfDialpadPageContent = (props: DialpadPageContentProps): JSX.Element => {
  const { adapter } = props;

  const [time, setTime] = useState<number>(0);
  const elapsedTime = getReadableTime(time);
  const startTime = useRef(performance.now());
  const adapterState = adapter.getState();
  const theme = useTheme();

  const calleeId = adapterState.targetCallees?.[0];
  const remoteParticipants = adapterState.call?.remoteParticipants;
  let calleeName;

  if (remoteParticipants) {
    calleeName = Object.values(remoteParticipants).find((p) => p.identifier === calleeId);
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(performance.now() - startTime.current);
    }, 10);
    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  return (
    <Stack style={{ height: '100%', width: '100%', background: theme.palette.white }}>
      <Stack style={{ margin: 'auto' }}>
        <Text styles={DtmfDialpadContentTimerStyles}>{elapsedTime}</Text>
        <Text>{calleeName !== 'Unnamed participant' ? calleeName : ''}</Text>
        <Dialpad
          onSendDtmfTone={async (tone: DtmfTone) => {
            await adapter.sendDtmfTone(tone);
          }}
          enableInputEditing={false}
        ></Dialpad>
      </Stack>
    </Stack>
  );
};

/**
 * @internal
 */
export const DtmfDialpadPage = (props: DialpadPageProps): JSX.Element => {
  const errorBarProps = usePropsFor(ErrorBar);
  const strings = useLocale().strings.call;
  const adapter = useAdapter();

  let callControlOptions = props.mobileView
    ? reduceCallControlsForMobile(props.options?.callControls)
    : props.options?.callControls;

  callControlOptions = disableCallControls(callControlOptions, [
    'cameraButton',
    'microphoneButton',
    'devicesButton',
    'screenShareButton',
    /* @conditional-compile-remove(PSTN-calls) */
    /* @conditional-compile-remove(one-to-n-calling) */
    'holdButton'
  ]);

  return (
    <CallArrangement
      complianceBannerProps={{ strings }}
      errorBarProps={props.options?.errorBar !== false && errorBarProps}
      callControlProps={{
        options: callControlOptions,
        increaseFlyoutItemSize: props.mobileView
      }}
      mobileView={props.mobileView}
      modalLayerHostId={props.modalLayerHostId}
      onRenderGalleryContent={() => <DtmfDialpadPageContent adapter={adapter} mobileView={props.mobileView} />}
      dataUiId={'hold-page'}
      updateSidePaneRenderer={props.updateSidePaneRenderer}
      mobileChatTabHeader={props.mobileChatTabHeader}
      latestErrors={props.latestErrors}
      onDismissError={props.onDismissError}
      /* @conditional-compile-remove(dtmf-dialer) */
      onSetDialpadPage={props.onSetDialpadPage}
    />
  );
};
