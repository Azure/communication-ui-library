// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureLogger } from '@azure/logger';
import { DefaultButton, Dialog, DialogFooter, DialogType, Link, PrimaryButton, Spinner, Text } from '@fluentui/react';
import React from 'react';
import { useEffect } from 'react';
import Shake from 'shake.js';

const HAS_SHAKE_FEATURE = typeof DeviceOrientationEvent !== 'undefined';

const originalConsoleLog = console.log;
const originalAzureLoggerLog = AzureLogger.log;
const consoleLogs: string[] = ['---- LOGS START ----'];

/**
 * Track console logs for pushing to a debug location.
 * This is particularly useful on mobile devices where the console is not easily accessible.
 */
const startRecordingLogs = (): void => {
  console.log = (...args: unknown[]) => {
    originalConsoleLog.apply(console, args);
    consoleLogs.push(`${new Date().toISOString()} ${safeJSONStringify(args)}`);
  };
  AzureLogger.log = (...args: unknown[]) => {
    originalAzureLoggerLog.apply(console, args);
    consoleLogs.push(`${new Date().toISOString()} ${safeJSONStringify(args)}`);
  };
};

const stopRecordingLogs = (): void => {
  console.log = originalConsoleLog;
  AzureLogger.log = originalAzureLoggerLog;
};

/**
 * Get the recorded console logs.
 * For more info see {@link startRecordingLogs}.
 */
const getRecordedLogs = (): string => {
  return consoleLogs.join('\n');
};

/** On iOS, device motion events require permission granted first */
interface DeviceMotionEventiOS extends DeviceMotionEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

/**
 * Hook to enable shake to send logs.
 * This should be used once in the app.
 */
const useShakeDialog = (hasPermission: boolean): [boolean, () => void] => {
  const [showDialog, setShowDialog] = React.useState(false);
  const closeDialog = React.useCallback(() => setShowDialog(false), []);
  const handleShake = (): void => {
    setShowDialog(true);
  };

  useEffect(() => {
    if (!hasPermission) {
      return;
    }

    const shakeEvent = new Shake({
      threshold: 15, // optional shake strength threshold
      timeout: 1000 // optional, determines the frequency of event generation
    });
    shakeEvent.start();

    startRecordingLogs();
    window.addEventListener('shake', handleShake);

    return () => {
      shakeEvent.stop();
      stopRecordingLogs();
      window.removeEventListener('shake', handleShake);
    };
  }, [hasPermission]);

  return [showDialog, closeDialog];
};

const requestPermission = async (): Promise<'granted' | 'denied'> => {
  try {
    return (await (DeviceOrientationEvent as unknown as DeviceMotionEventiOS)?.requestPermission?.()) ?? 'granted';
  } catch (e) {
    console.log('DeviceMotionEvent.requestPermission() failed', e);
    return 'denied';
  }
};

const sendLogs = async (): Promise<string | false> => {
  const logs = getRecordedLogs();

  const containerName = 'chat-sample-logs';
  const response = await fetch(`/uploadToAzureBlobStorage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: safeJSONStringify({ containerName, logs })
  });

  if (!response.ok) {
    console.error('Failed to upload logs to Azure Blob Storage', response);
    return false;
  }

  const blobUrl = await response.text();
  console.log(`Logs uploaded to ${blobUrl}`);
  return blobUrl;
};

const PromptForShakePermission = (props: { onPermissionGranted: () => void }): JSX.Element => {
  const [showPrompt, setShowPrompt] = React.useState(true);
  const closePrompt = React.useCallback(() => setShowPrompt(false), []);
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Enable permissions for shake to help',
    subText:
      'Would you like to enable shake to help? This will prompt you to send device logs when you shake your device.'
  };

  return (
    <Dialog hidden={!showPrompt} dialogContentProps={dialogContentProps}>
      <DialogFooter>
        <PrimaryButton
          text="Enable"
          onClick={() => {
            requestPermission().then((res) => {
              if (res === 'granted') {
                props.onPermissionGranted();
              }
              setShowPrompt(false);
            });
          }}
        />
        <DefaultButton onClick={closePrompt} text="Disable" />
      </DialogFooter>
    </Dialog>
  );
};

export const ShakeToSendLogs = (): JSX.Element => {
  const needsToRequestDeviceMotionPermission =
    HAS_SHAKE_FEATURE && !!(DeviceOrientationEvent as unknown as DeviceMotionEventiOS)?.requestPermission;
  const [hasPermission, setHasPermission] = React.useState(!needsToRequestDeviceMotionPermission);
  const [showDialog, closeDialog] = useShakeDialog(hasPermission);

  const [logStatus, setLogStatus] = React.useState<'unsent' | 'sending' | 'failed' | 'sent'>('unsent');
  const [blobUrl, setBlobUrl] = React.useState<string>();

  const reset = (): void => {
    setLogStatus('unsent');
    setBlobUrl(undefined);
  };

  const onSendLogsClick = async (): Promise<void> => {
    setLogStatus('sending');
    try {
      const result = await sendLogs();
      if (result) {
        setLogStatus('sent');
        setBlobUrl(result);
      } else {
        setLogStatus('failed');
      }
    } catch {
      setLogStatus('failed');
    }
  };

  const dialogContentProps = {
    type: DialogType.normal,
    title: logStatus === 'sent' ? 'Logs sent!' : 'Send logs',
    subText: logStatus === 'sent' ? undefined : 'We detected a shake. Would you like to send logs to help us debug?'
  };

  return (
    <>
      {needsToRequestDeviceMotionPermission && (
        <PromptForShakePermission onPermissionGranted={() => setHasPermission(true)} />
      )}
      <Dialog hidden={!showDialog} dialogContentProps={dialogContentProps} modalProps={{ onDismissed: reset }}>
        <Spinner hidden={logStatus !== 'sending'} label="Sending logs..." />
        {logStatus === 'unsent' && (
          <DialogFooter>
            <PrimaryButton onClick={onSendLogsClick} text="Send" />
            <DefaultButton onClick={closeDialog} text="Don't send" />
          </DialogFooter>
        )}
        {logStatus === 'sent' && (
          <>
            <Text>
              Your logs were successfully uploaded. You can access them{' '}
              <Link href={blobUrl} target="_blank">
                here
              </Link>
              .
            </Text>
            <DialogFooter>
              <PrimaryButton
                text="Send as email"
                onClick={() => window.open(`mailto:?body=${encodeURIComponent(blobUrl ?? '')}`)}
              />
              <DefaultButton onClick={closeDialog} text="Close" />
            </DialogFooter>
          </>
        )}
        {logStatus === 'failed' && (
          <>
            <Text>Failed to send logs.</Text>
            <DialogFooter>
              <PrimaryButton onClick={onSendLogsClick} text="Try again" />
              <DefaultButton onClick={closeDialog} text="Close" />
            </DialogFooter>
          </>
        )}
      </Dialog>
    </>
  );
};

/**
 * Wrap JSON.stringify in a try-catch as JSON.stringify throws an exception if it fails.
 * Use this only in areas where the JSON.stringify is non-critical and OK for the JSON.stringify to fail, such as logging.
 */
export const safeJSONStringify = (
  value: unknown,
  replacer?: ((this: unknown, key: string, value: unknown) => unknown) | undefined,
  space?: string | number | undefined
): string | undefined => {
  try {
    return JSON.stringify(value, replacer, space);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
