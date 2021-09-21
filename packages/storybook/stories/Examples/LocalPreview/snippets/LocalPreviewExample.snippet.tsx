import {
  ControlBarButton,
  StreamMedia,
  VideoTile,
  CameraButton,
  MicrophoneButton,
  FluentThemeProvider,
  useTheme
} from '@azure/communication-react';

import {
  Stack,
  mergeStyles,
  Text,
  ContextualMenuItemType,
  IContextualMenuItem,
  IContextualMenuProps,
  DirectionalHint,
  AnimationStyles,
  css
} from '@fluentui/react';
import { VideoOff20Filled, Speaker220Regular, Speaker220Filled } from '@fluentui/react-icons';
import React, { useCallback, useState } from 'react';
import { useVideoStreams } from '../../../utils';

export interface LocalPreviewProps {
  flyoutType: string;
  isVideoAvailable: boolean;
  isCameraEnabled: boolean;
  isMicrophoneEnabled: boolean;
}

const generateSpeakerMenuProps = (): { items: IContextualMenuItem[] } | undefined => {
  const speakerMenuProps: IContextualMenuProps = {
    items: [
      {
        key: 'speakertitle',
        itemType: ContextualMenuItemType.Header,
        text: 'Speakers'
      },
      {
        key: 'speaker1',
        title: 'Speaker Title',
        text: 'Speaker Title',
        iconProps: { iconName: 'OptionsSpeaker', styles: { root: { lineHeight: 0 } } },
        itemType: ContextualMenuItemType.Normal,
        subMenuProps: {
          items: [
            {
              key: 'speaker01',
              text: 'Sub Speaker 1',
              title: 'Sub Speaker 1',
              iconProps: { iconName: 'OptionsSpeaker', styles: { root: { lineHeight: 0 } } }
            },
            {
              key: 'speaker02',
              text: 'Sub Speaker 2',
              title: 'Sub Speaker 2',
              iconProps: { iconName: 'OptionsSpeaker', styles: { root: { lineHeight: 0 } } }
            }
          ]
        }
      },
      {
        key: 'speaker1',
        title: 'Speaker Title',
        text: 'Speaker Title',
        iconProps: { iconName: 'OptionsSpeaker', styles: { root: { lineHeight: 0 } } },
        itemType: ContextualMenuItemType.Normal
      },
      {
        key: 'speaker1',
        title: 'Speaker Title',
        text: 'Speaker Title',
        iconProps: { iconName: 'OptionsSpeaker', styles: { root: { lineHeight: 0 } } },
        itemType: ContextualMenuItemType.Normal
      }
    ],
    directionalHint: DirectionalHint.topAutoEdge,
    calloutProps: {
      // layerProps: { hostId: 'flyoutHost' },

      // Confine the menu to the parents bounds.
      // More info: https://github.com/microsoft/fluentui/issues/18835
      styles: { root: { maxWidth: '100%' } }
    }
  };

  return speakerMenuProps;
};

const DrawerMenuItem = (props: { onItemClicked?: () => void }): JSX.Element => {
  return (
    <Stack
      horizontal
      styles={{
        root: {
          padding: '0.9rem',
          cursor: 'pointer',
          ':hover': {
            background: '#EDEBE9'
          }
        }
      }}
      tokens={{ childrenGap: '0.9rem' }}
      onClick={props.onItemClicked}
    >
      <Stack.Item>
        <Speaker220Regular primaryFill="currentColor" />
      </Stack.Item>
      <Stack.Item>{'Speaker title'}</Stack.Item>
    </Stack>
  );
};

const DrawerDismiss = (props: { onDismiss: () => void }): JSX.Element => {
  return (
    <Stack styles={{ root: { height: '100%' } }} grow onClick={() => props.onDismiss()}>
      <></>
    </Stack>
  );
};

const DrawerItemContainer = (props: { children: React.ReactNode }): JSX.Element => {
  return (
    <Stack
      styles={{
        root: {
          background: 'white',

          borderTopRightRadius: '1rem',
          borderTopLeftRadius: '1rem',
          'div:first-child': {
            borderTopRightRadius: '1rem',
            borderTopLeftRadius: '1rem'
          }
        }
      }}
    >
      {props.children}
    </Stack>
  );
};

const DrawerMenu = (props: { onDismiss: () => void }): JSX.Element => {
  return (
    <Stack
      verticalFill
      styles={{
        root: {
          position: 'absolute',
          bottom: 0,
          width: '100%',
          color: '#212121',
          background: 'rgba(0,0,0,0.6)',
          ...AnimationStyles.slideUpIn10
        }
      }}
    >
      <DrawerDismiss onDismiss={props.onDismiss} />
      <DrawerItemContainer>
        <DrawerMenuItem onItemClicked={props.onDismiss} />
        <DrawerMenuItem onItemClicked={props.onDismiss} />
        <DrawerMenuItem onItemClicked={props.onDismiss} />
        <DrawerMenuItem onItemClicked={props.onDismiss} />
      </DrawerItemContainer>
    </Stack>
  );
};

export const LocalPreviewExample = ({
  isVideoAvailable,
  isCameraEnabled,
  isMicrophoneEnabled,
  flyoutType
}: LocalPreviewProps): JSX.Element => {
  const [microphone, setMicrophone] = useState(true);
  const [camera, setCamera] = useState(true);
  const theme = useTheme();
  const palette = theme.palette;

  const isContextMenu = flyoutType === 'ContextMenu';
  const isDrawer = flyoutType === 'Drawer';
  const [drawerShown, setDrawerShown] = useState(false);

  const localPreviewContainerStyle = mergeStyles({
    width: '100% !important',
    height: '100%',
    minHeight: '16.875rem',
    margin: '0 auto',
    background: palette.neutralLighter,
    color: palette.neutralTertiary
  });

  const videoTileStyle = {
    root: {
      height: '100%'
    }
  };

  const cameraOffLabelStyle = mergeStyles({
    fontFamily: 'Segoe UI Regular',
    fontSize: '0.625rem', // 10px
    color: palette.neutralTertiary
  });

  const renderCameraOffPlaceholder = useCallback(
    () => (
      <Stack style={{ width: '100\u0025', height: '100\u0025' }} verticalAlign="center">
        <Stack.Item align="center">
          <VideoOff20Filled primaryFill="currentColor" />
        </Stack.Item>
        <Stack.Item align="center">
          <Text className={cameraOffLabelStyle}>Your camera is turned off</Text>
        </Stack.Item>
      </Stack>
    ),
    [cameraOffLabelStyle]
  );

  const videoStreams = useVideoStreams(1);
  const videoStreamElement = isVideoAvailable ? videoStreams[0] : null;

  return (
    <FluentThemeProvider fluentTheme={theme}>
      <Stack
        style={{ width: '100%', height: '100%' }}
        verticalAlign="center"
        styles={{
          root: {
            background: 'black',
            width: '20rem !important',
            height: '25rem !important',
            margin: '2rem auto',
            border: '3px solid blue'
          }
        }}
      >
        <Stack.Item align="center" style={{ width: '100%', height: '100%' }}>
          <Stack className={localPreviewContainerStyle}>
            <VideoTile
              styles={videoTileStyle}
              // Here this storybook example isn't connected with Azure Communication Services
              // We would suggest you replace this videoStreamElement below with a rendered video stream from the calling SDK
              renderElement={
                isVideoAvailable && isCameraEnabled && camera ? (
                  <StreamMedia videoStreamElement={videoStreamElement} />
                ) : undefined
              }
              onRenderPlaceholder={renderCameraOffPlaceholder}
            >
              <Stack
                horizontal
                horizontalAlign="center"
                verticalAlign="end"
                tokens={{ childrenGap: '0.5rem' }}
                verticalFill
                styles={{ root: { marginBottom: '1rem' } }}
              >
                <MicrophoneButton
                  disabled={!isMicrophoneEnabled}
                  checked={isMicrophoneEnabled ? microphone : false}
                  onClick={() => setMicrophone(!microphone)}
                  showLabel={true}
                  strings={{ onLabel: 'Mic is on', offLabel: 'Mic is off' }}
                  styles={{
                    root: { background: theme.palette.neutralQuaternaryAlt, borderRadius: theme.effects.roundedCorner6 }
                  }}
                />

                <CameraButton
                  disabled={!isCameraEnabled}
                  checked={isCameraEnabled ? camera : false}
                  onClick={() => setCamera(!camera)}
                  showLabel={true}
                  strings={{ onLabel: 'Video is on', offLabel: 'Video is off' }}
                  styles={{
                    root: { background: theme.palette.neutralQuaternaryAlt, borderRadius: theme.effects.roundedCorner6 }
                  }}
                />

                <ControlBarButton
                  checked={true}
                  showLabel={true}
                  strings={{ label: 'Device' }}
                  styles={{
                    root: { background: theme.palette.neutralQuaternaryAlt, borderRadius: theme.effects.roundedCorner6 }
                  }}
                  onRenderIcon={() => <Speaker220Filled primaryFill="currentColor" />}
                  menuIconProps={{ hidden: true }}
                  menuProps={isContextMenu ? generateSpeakerMenuProps() : undefined}
                  onClick={() => isDrawer && setDrawerShown(!drawerShown)}
                />
              </Stack>
              {drawerShown && <DrawerMenu onDismiss={() => setDrawerShown(false)} />}
            </VideoTile>
          </Stack>
        </Stack.Item>
      </Stack>
    </FluentThemeProvider>
  );
};
