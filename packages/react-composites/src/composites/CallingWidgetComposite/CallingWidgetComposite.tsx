// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { CallAdapter, CallAdapterState, CallCompositeOptions } from '../CallComposite';
import {
  AzureCommunicationCallAdapterArgs,
  AzureCommunicationOutboundCallAdapterArgs
} from '../CallComposite/adapter/AzureCommunicationCallAdapter';
import { CallScreen } from './components/CallScreen';
import { WaitingScreen } from './components/WaitingScreen';
import { SetupScreen } from './components/SetupScreen';
import { BaseCompositeProps, BaseProvider } from '../common/BaseComposite';
import { CallCompositeIcons } from '../common/icons';

/**
 * What are the things that we want to be customizable?
 * - Header content
 * - Colour theme
 * - Adapter options
 * - Fields in the widget setup state (think custom button injection)
 * - ability to replace the waiting state element
 * - widget position - default bottom right
 *
 */

/**
 * Props for creating custom fields in the widget. This should be used for scenarios like:
 * - Collecting information from users
 * - Toggling controls outside calling experience
 * @public
 */
export interface CustomField {
  /**
   * Type of input that the new field can be
   */
  kind: 'checkBox' | 'inputBox';
  /**
   * Label for the input
   */
  label: string;
  /**
   * Callback to allow the change of data in a field to be tracked
   *
   * @param newValue - New value of the field when the value changes
   */
  onChange: (newValue: boolean | string) => void;
  /**
   * Callback to take and action when the call starts in the widget for the fields.
   * @returns
   */
  onCallStart: () => void;
}

/**
 * Position of the widget in the application. will float in the bottom right of the parent with a position of relative set in CSS.
 *
 * Use 'unset' for using widget in a floating position inside a container.
 * @default 'bottomRight'
 * @public
 */
export type WidgetPosition = 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft' | 'unset';

/**
 * Options for the CallingWidgetComposite
 * @public
 */
export type CallingWidgetCallCompositeOptions = Partial<CallCompositeOptions> & {
  /**
   * Control to determine whether the user can set their name or if the name given in the adapter
   * arguments is used.
   */
  showDisplayNameField?: boolean;
  /**
   * Control to hide the use video option in the widget
   */
  showVideoOptIn?: boolean;
  /**
   * An array of Custom fields to be added to the widget setup. These will be rendered in line with
   * the other stylings of the widget fields provided.
   */
  customFieldProps: CustomField[];
  /**
   * Custom render function for displaying logo.
   */
  onRenderLogo?: () => JSX.Element;
};

/**
 * Props for the CallingWidgetComposite
 * @public
 */
export interface CallingWidgetCompositeProps extends BaseCompositeProps<CallCompositeIcons> {
  /**
   *  arguments for creating an AzureCommunicationCallAdapter for your Calling experience
   */
  adapterProps: AzureCommunicationOutboundCallAdapterArgs | AzureCommunicationCallAdapterArgs;
  /**
   * Position in the parent container that the widget will render.
   */
  position?: WidgetPosition;
  /**
   * Custom render callback for the waiting state of the widget.
   */
  onRenderIdleWidget?: () => JSX.Element;
  /**
   * UI options for the CallingWdigetComposite and the CallComposite inside
   */
  options?: CallingWidgetCallCompositeOptions;
}

const MainWidget = (props: CallingWidgetCompositeProps): JSX.Element => {
  const { adapterProps, options, onRenderIdleWidget } = props;

  const [widgetState, setWidgetState] = useState<'new' | 'setup' | 'inCall'>('new');
  const [displayName, setDisplayName] = useState<string>();
  const [consentToData, setConsentToData] = useState<boolean>(false);
  const [useLocalVideo, setUseLocalVideo] = useState<boolean>(false);
  const [adapter, setAdapter] = useState<CallAdapter>();

  const callIdRef = useRef<string>();

  /**
   * We want to extract the options for the CallComposite from the Union of the widget and composite options
   * to be used on the CallScreen.
   */
  const callCompositeOptions: CallCompositeOptions | undefined = useMemo(() => {
    if (options) {
      const compositeOptions = { ...options };
      return compositeOptions;
    } else {
      return undefined;
    }
  }, [options]);

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

      adapter.onStateChange((state: CallAdapterState) => {
        if (state?.call?.id && callIdRef.current !== state?.call?.id) {
          callIdRef.current = state?.call?.id;
          console.log(`Call Id: ${callIdRef.current}`);
        }
      });
    }
  }, [adapter]);

  if (widgetState === 'setup') {
    return (
      <SetupScreen
        callAdapterArgs={adapterProps}
        consentToData={consentToData}
        setConsentToData={setConsentToData}
        setDisplayName={setDisplayName}
        displayName={displayName}
        setAdapter={setAdapter}
        setUseLocalVideo={setUseLocalVideo}
        setWidgetState={setWidgetState}
        adapter={adapter}
        customFields={options?.customFieldProps}
        showVideoOptIn={options?.showVideoOptIn}
        showDisplayNameField={options?.showDisplayNameField}
      />
    );
  }

  if (widgetState === 'inCall' && adapter) {
    return <CallScreen adapter={adapter} useLocalVideo={useLocalVideo} options={callCompositeOptions} />;
  }

  return onRenderIdleWidget ? <Stack>{onRenderIdleWidget()}</Stack> : <WaitingScreen setWidgetState={setWidgetState} />;
};

/**
 * Composite for Calling Widget experiences
 * @param props - properties for creating the CallingWidgetComposite
 * @public
 */
export const CallingWidgetComposite = (props: CallingWidgetCompositeProps): JSX.Element => {
  return (
    <div>
      <BaseProvider>
        <MainWidget {...props} />
      </BaseProvider>
    </div>
  );
};
