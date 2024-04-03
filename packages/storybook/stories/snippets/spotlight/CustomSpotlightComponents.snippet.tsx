import { Call, CallAgent, Features, MeetingLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAgentProvider,
  CallClientProvider,
  CallProvider,
  CameraButton,
  CompositeLocale,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton,
  ScreenShareButton,
  StatefulCallClient,
  VideoGallery,
  VideoStreamOptions,
  createStatefulCallClient,
  fromFlatCommunicationIdentifier,
  toFlatCommunicationIdentifier,
  useCall,
  usePropsFor
} from '@azure/communication-react';
import { Dropdown, IDropdownOption, PartialTheme, PrimaryButton, Stack, Theme, mergeStyles } from '@fluentui/react';
import React, { useEffect, useState } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  formFactor?: 'desktop' | 'mobile';
  fluentTheme?: PartialTheme | Theme;
  locale?: CompositeLocale;
  meetingLink?: string;
  displayName?: string;
};

export const ContosoCallContainer = (props: ContainerProps): JSX.Element => {
  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent>();
  const [call, setCall] = useState<Call>();

  useEffect(() => {
    const statefulCallClient = createStatefulCallClient({
      userId: { communicationUserId: toFlatCommunicationIdentifier(props.userId) }
    });

    // Request camera and microphone access once we have access to the device manager
    statefulCallClient.getDeviceManager().then((deviceManager) => {
      deviceManager.askDevicePermission({ video: true, audio: true });
    });

    setStatefulCallClient(statefulCallClient);
  }, [props.userId]);

  useEffect(() => {
    const tokenCredential = new AzureCommunicationTokenCredential(props.token);
    if (callAgent === undefined && statefulCallClient && props.displayName) {
      const createUserAgent = async (): Promise<void> => {
        setCallAgent(await statefulCallClient.createCallAgent(tokenCredential, { displayName: props.displayName }));
      };
      createUserAgent();
    }
  }, [props.token, statefulCallClient, props.displayName, callAgent]);

  useEffect(() => {
    if (callAgent !== undefined) {
      setCall(callAgent.join({ meetingLink: props.meetingLink } as MeetingLocator));
    }
  }, [callAgent, props.meetingLink]);

  return (
    <FluentThemeProvider>
      <>
        {statefulCallClient && (
          <CallClientProvider callClient={statefulCallClient}>
            {callAgent && (
              <CallAgentProvider callAgent={callAgent}>
                {call && (
                  <CallProvider call={call}>
                    <CallingComponents />
                  </CallProvider>
                )}
              </CallAgentProvider>
            )}
          </CallClientProvider>
        )}
      </>
    </FluentThemeProvider>
  );
};

const CallingComponents = (): JSX.Element => {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraProps = usePropsFor(CameraButton);
  const microphoneProps = usePropsFor(MicrophoneButton);
  const screenShareProps = usePropsFor(ScreenShareButton);
  const endCallProps = usePropsFor(EndCallButton);
  const call = useCall();

  // Only enable buttons when the call has connected.
  // For more advanced handling of pre-call configuration, see our other samples such as [Call Readiness](../../ui-library-call-readiness/README.md)
  const buttonsDisabled = !(call?.state === 'InLobby' || call?.state === 'Connected');

  if (call?.state === 'Disconnected') {
    return <CallEnded />;
  }

  const onChange = (_: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
    if (item) {
      setSelectedParticipants(
        item.selected
          ? [...selectedParticipants, item.key as string]
          : selectedParticipants.filter((key) => key !== item.key)
      );
    }
  };

  return (
    <Stack className={mergeStyles({ height: '100%' })}>
      <div style={{ width: '100vw', height: '100vh' }}>
        {videoGalleryProps && <VideoGallery {...videoGalleryProps} localVideoViewOptions={localViewVideoOptions} />}
      </div>

      <ControlBar layout="floatingBottom">
        {cameraProps && <CameraButton {...cameraProps} disabled={buttonsDisabled ?? cameraProps.disabled} />}
        {microphoneProps && (
          <MicrophoneButton {...microphoneProps} disabled={buttonsDisabled ?? microphoneProps.disabled} />
        )}
        {screenShareProps && <ScreenShareButton {...screenShareProps} disabled={buttonsDisabled} />}
        {endCallProps && <EndCallButton {...endCallProps} disabled={buttonsDisabled} />}
        <Dropdown
          placeholder="Select participants to spotlight"
          label="Spotlight participants"
          selectedKeys={selectedParticipants}
          onChange={onChange}
          multiSelect
          options={videoGalleryProps.remoteParticipants.map((participant) => ({
            key: participant.userId,
            text: participant.displayName ?? 'Unnamed participant'
          }))}
        />
        <PrimaryButton
          onClick={() => {
            if (call && selectedParticipants && selectedParticipants.length > 0) {
              call
                .feature(Features.Spotlight)
                .startSpotlight(selectedParticipants.map((p) => fromFlatCommunicationIdentifier(p)));
            }
          }}
          disabled={!call || !selectedParticipants || selectedParticipants.length === 0}
        >
          Spotlight participant(s)
        </PrimaryButton>
      </ControlBar>
    </Stack>
  );
};

const localViewVideoOptions: VideoStreamOptions = {
  isMirrored: true,
  scalingMode: 'Fit'
};

const CallEnded = (): JSX.Element => {
  return <h1>You ended the call.</h1>;
};
