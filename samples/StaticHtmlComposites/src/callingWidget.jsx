// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CallComposite, createAzureCommunicationCallAdapter } from '@azure/communication-react';
import { initializeIcons, Stack, TextField, IconButton, Checkbox, PrimaryButton, Spinner, Icon, useTheme, registerIcons } from '@fluentui/react';
import { CallAdd20Regular, Dismiss20Regular } from '@fluentui/react-icons';

initializeIcons();
export const loadCallingWidget = async function (args, htmlElement, props) {

  if (!htmlElement) {
    throw new Error('Failed to find the root element');
  }

  createRoot(htmlElement).render(React.createElement(CallingWidgetComponent, { ...props, ...args }, null));
  /**
   * This assumes that the widget is subscribing to everything that Contoso needs from the CallAdapter so its not returning it back.
   */
};

export const CallingWidgetComponent = (props) => {
  registerIcons({
    icons: { dismiss: <Dismiss20Regular />, callAdd: <CallAdd20Regular /> },
  });
  const { onRenderLogo, token, userId, targetCallees } = props;

  const [widgetState, setWidgetState] = useState('new');
  const [displayName, setDisplayName] = useState();
  const [consentToData, setConsentToData] = useState(false);
  const [useLocalVideo, setUseLocalVideo] = useState(false);
  const [adapter, setAdapter] = useState();

  const callIdRef = useRef();

  const theme = useTheme();

  // add this before the React template
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [token]);

  const callAdapterArgs = useMemo(() => {
    return {
      userId: userId,
      credential: credential,
      targetCallees: targetCallees,
      displayName: displayName
    };
  }, [userId, targetCallees, credential, displayName]);

  useEffect(() => {
    if (adapter) {
      adapter.on('callEnded', () => {
        /**
         * We only want to reset the widget state if the call that ended is the same as the current call.
         */
        if (
          adapter.getState().acceptedTransferCallState &&
          adapter.getState().acceptedTransferCallState?.id !== callIdRef.current
        ) {
          return;
        }
        setDisplayName(undefined);
        setWidgetState('new');
        setConsentToData(false);
        setAdapter(undefined);
        adapter.dispose();
      });

      adapter.on('transferAccepted', (e) => {
        console.log('transferAccepted', e);
      });

      adapter.onStateChange((state) => {
        if (state?.call?.id && callIdRef.current !== state?.call?.id) {
          callIdRef.current = state?.call?.id;
          console.log(`Call Id: ${callIdRef.current}`);
        }
      });
    }
  }, [adapter]);

  /** widget template for when widget is open, put any fields here for user information desired */
  if (widgetState === 'setup') {
    return (
      <Stack styles={callingWidgetSetupContainerStyles(theme)} tokens={{ childrenGap: '1rem' }}>
        <IconButton
          styles={collapseButtonStyles}
          iconProps={{ iconName: 'Dismiss' }}
          onClick={() => {
            setDisplayName(undefined);
            setConsentToData(false);
            setUseLocalVideo(false);
            setWidgetState('new');
          }}
        />
        <Stack tokens={{ childrenGap: '1rem' }} styles={logoContainerStyles}>
          <Stack style={{ transform: 'scale(1.8)' }}>{onRenderLogo && onRenderLogo()}</Stack>
        </Stack>
        <TextField
          label={'Name'}
          required={true}
          placeholder={'Enter your name'}
          onChange={(_, newValue) => {
            setDisplayName(newValue);
          }}
        />
        <Checkbox
          styles={checkboxStyles(theme)}
          label={'Use video - Checking this box will enable camera controls and screen sharing'}
          onChange={(_, checked) => {
            setUseLocalVideo(!!checked);
            setUseLocalVideo(true);
          }}
        ></Checkbox>
        <Checkbox
          required={true}
          styles={checkboxStyles(theme)}
          disabled={displayName === undefined}
          label={
            'By checking this box, you are consenting that we will collect data from the call for customer support reasons'
          }
          onChange={async (_, checked) => {
            setConsentToData(!!checked);
            if (callAdapterArgs && callAdapterArgs.credential) {
              setAdapter(
                await createAzureCommunicationCallAdapter({
                  displayName: displayName ?? '',
                  userId: callAdapterArgs.userId,
                  credential: callAdapterArgs.credential,
                  targetCallees: callAdapterArgs.targetCallees
                })
              );
            }
          }}
        ></Checkbox>
        <PrimaryButton
          styles={startCallButtonStyles(theme)}
          onClick={() => {
            if (displayName && consentToData && adapter) {
              setWidgetState('inCall');
              adapter?.startCall(callAdapterArgs.targetCallees, {
                audioOptions: { muted: false }
              });
            }
          }}
        >
          {!consentToData && `Enter your name`}
          {consentToData && !adapter && <Spinner ariaLive="assertive" labelPosition="top" />}
          {consentToData && adapter && `StartCall`}
        </PrimaryButton>
      </Stack>
    );
  }

  if (widgetState === 'inCall' && adapter) {
    return (
      <Stack styles={callingWidgetInCallContainerStyles(theme)}>
        <CallComposite
          adapter={adapter}
          options={{
            callControls: {
              cameraButton: useLocalVideo,
              screenShareButton: useLocalVideo,
              moreButton: false,
              peopleButton: false,
              displayType: 'compact'
            },
            localVideoTile: !useLocalVideo ? false : { position: 'floating' }
          }}
        />
      </Stack>
    );
  }

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      styles={callingWidgetContainerStyles(theme)}
      onClick={() => {
        setWidgetState('setup');
      }}
    >
      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        style={{
          height: '4rem',
          width: '4rem',
          borderRadius: '50%',
          background: theme.palette.themePrimary
        }}
      >
        <Icon iconName="callAdd" styles={callIconStyles(theme)} />
      </Stack>
    </Stack>
  );
};

const checkboxStyles = (theme) => {
  return {
    label: {
      color: theme.palette.neutralPrimary
    }
  };
};

const callingWidgetContainerStyles = (theme) => {
  return {
    root: {
      width: '5rem',
      height: '5rem',
      padding: '0.5rem',
      boxShadow: theme.effects.elevation16,
      borderRadius: '50%',
      bottom: '1rem',
      right: '1rem',
      position: 'absolute',
      overflow: 'hidden',
      cursor: 'pointer',
      ':hover': {
        boxShadow: theme.effects.elevation64
      }
    }
  };
};

const callingWidgetSetupContainerStyles = (theme) => {
  return {
    root: {
      width: '18rem',
      minHeight: '20rem',
      maxHeight: '25rem',
      padding: '0.5rem',
      boxShadow: theme.effects.elevation16,
      borderRadius: theme.effects.roundedCorner6,
      bottom: 0,
      right: '1rem',
      position: 'absolute',
      overflow: 'hidden',
      cursor: 'pointer',
      background: theme.palette.white
    }
  };
};

const callIconStyles = (theme) => {
  return {
    root: {
      paddingTop: '0.2rem',
      color: theme.palette.white,
      transform: 'scale(1.6)'
    }
  };
};

const startCallButtonStyles = (theme) => {
  return {
    root: {
      background: theme.palette.themePrimary,
      borderRadius: theme.effects.roundedCorner6,
      borderColor: theme.palette.themePrimary
    },
    textContainer: {
      color: theme.palette.white
    }
  };
};

const logoContainerStyles = {
  root: {
    margin: 'auto',
    padding: '0.2rem',
    height: '5rem',
    width: '10rem',
    zIndex: 0
  }
};

const collapseButtonStyles = {
  root: {
    position: 'absolute',
    top: '0.2rem',
    right: '0.2rem',
    zIndex: 1
  }
};

const callingWidgetInCallContainerStyles = (theme) => {
  return {
    root: {
      width: '35rem',
      height: '25rem',
      padding: '0.5rem',
      boxShadow: theme.effects.elevation16,
      borderRadius: theme.effects.roundedCorner6,
      bottom: 0,
      right: '1rem',
      position: 'absolute',
      overflow: 'hidden',
      cursor: 'pointer',
      background: theme.semanticColors.bodyBackground
    }
  };
};
