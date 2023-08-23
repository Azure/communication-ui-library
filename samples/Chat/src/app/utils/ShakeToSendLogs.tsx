// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureLogger } from '@azure/logger';
import { DefaultButton, Dialog, DialogFooter, DialogType, Link, PrimaryButton, Spinner, Text } from '@fluentui/react';
import React from 'react';
import { useEffect } from 'react';
import Shake from 'shake.js';
import { useIsMobile } from './useIsMobile';

const HAS_SHAKE_FEATURE = typeof DeviceOrientationEvent !== 'undefined';
const NEEDS_SHAKE_PERMISSION =
  HAS_SHAKE_FEATURE && !!(DeviceOrientationEvent as unknown as DeviceMotionEventiOS)?.requestPermission;

const logs: string[] = ['---- LOGS START ----'];
// Ensure we cap any single log line to prevent the server from rejecting the request.
const logLineCharacterLimit = 1000;
// If there is a failure to send logs due to size, typically due to a very long call, retry with a smaller size.
const logLengthMaxSize = 1000000;

const storeLog = (logType: string, log: string | undefined): void => {
  log && logs.push(`${logType} ${new Date().toISOString()} ${log}`.slice(0, logLineCharacterLimit));
};

/**
 * Track console logs for pushing to a debug location.
 * This is particularly useful on mobile devices where the console is not easily accessible.
 */
const startRecordingLogs = (): void => {
  function hookLogType(logType: string): (...args: unknown[]) => void {
    const original = console[logType].bind(console);
    return function (...args: unknown[]) {
      storeLog(logType, safeJSONStringify(args));
      original.apply(console, args);
    };
  }

  console.log = hookLogType('log');
  console.warn = hookLogType('warn');
  console.error = hookLogType('error');
  console.info = hookLogType('info');
  console.debug = hookLogType('debug');

  AzureLogger.log = hookLogType('log');

  window.addEventListener('error', function (event) {
    storeLog('error', safeJSONStringify(event));
  });
  window.addEventListener('unhandledrejection', function (event) {
    storeLog('error', safeJSONStringify(event));
  });
};

/**
 * Get the recorded console logs.
 * For more info see {@link startRecordingLogs}.
 */
const getRecordedLogs = (): string => {
  return logs.join('\n');
};

/** On iOS, device motion events require permission granted first */
interface DeviceMotionEventiOS extends DeviceMotionEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

/**
 * Hook to enable shake to send logs.
 * This should be used once in the app.
 */
const useShakeDialog = (hasPermission: boolean, disabled: boolean): [boolean, () => void] => {
  const [showDialog, setShowDialog] = React.useState(false);
  const closeDialog = React.useCallback(() => setShowDialog(false), []);
  const handleShake = (): void => {
    setShowDialog(true);
  };

  useEffect(() => {
    if (disabled || !hasPermission) {
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
      window.removeEventListener('shake', handleShake);
    };
  }, [disabled, hasPermission]);

  return [showDialog, closeDialog];
};

const checkExistingPermissionState = async (): Promise<boolean> => {
  // If the user has already granted permission, the requestPermission returns 'granted'.
  // Otherwise the API throws an exception and we can assume the user has not granted permission.
  try {
    const result = await (DeviceOrientationEvent as unknown as DeviceMotionEventiOS)?.requestPermission?.();
    return result === 'granted';
  } catch (e) {
    return false;
  }
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
  let response = await postLogsToServer(containerName, logs);

  // check for 413, which means the logs are too large to upload
  if (response.status === 413) {
    alert('Logs too large to upload. Trimming logs and retrying.');
    const trimmedLogs = logs.slice(-logLengthMaxSize);
    response = await postLogsToServer(containerName, trimmedLogs);
  }

  if (!response.ok) {
    console.error('Failed to upload logs to Azure Blob Storage', response);
    return false;
  }

  const blobUrl = await response.text();
  console.log(`Logs uploaded to ${blobUrl}`);
  return blobUrl;
};

const postLogsToServer = async (containerName: string, logs: string): Promise<Response> =>
  fetch(`/uploadToAzureBlobStorage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: safeJSONStringify({ containerName, logs })
  });

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
  const disableShakeLogs = !useIsMobile();
  const [hasPermission, setHasPermission] = React.useState(!NEEDS_SHAKE_PERMISSION);
  const [showRequestPermissionDialog, setShowRequestPermissionDialog] = React.useState(false);
  useEffect(() => {
    if (NEEDS_SHAKE_PERMISSION && !disableShakeLogs) {
      checkExistingPermissionState().then((existingPermissionState) => {
        if (!existingPermissionState) {
          setShowRequestPermissionDialog(true);
        } else {
          setHasPermission(true);
        }
      });
    }
  }, [disableShakeLogs]);

  const [showDialog, closeDialog] = useShakeDialog(hasPermission, disableShakeLogs);

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
      {!hasPermission && showRequestPermissionDialog && (
        <PromptForShakePermission
          onPermissionGranted={() => {
            setHasPermission(true);
            setShowRequestPermissionDialog(false);
          }}
        />
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
  value?: unknown,
  replacer?: ((this: unknown, key: string, value: unknown) => unknown) | undefined,
  space?: string | number | undefined
): string | undefined => {
  if (!value) {
    return;
  }

  try {
    return JSON.stringify(value, replacer, space);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
