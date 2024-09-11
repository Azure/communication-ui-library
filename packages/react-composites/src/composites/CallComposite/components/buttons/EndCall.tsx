// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { concatStyleSets, Stack } from '@fluentui/react';
/* @conditional-compile-remove(breakout-rooms) */
import { IContextualMenuProps } from '@fluentui/react';
import { ControlBarButtonStyles, EndCallButton } from '@internal/react-components';
import React, { useMemo } from 'react';
/* @conditional-compile-remove(end-call-options) */
import { useState, useCallback } from 'react';
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
import { usePropsFor } from '../../hooks/usePropsFor';
import { groupCallLeaveButtonCompressedStyle, groupCallLeaveButtonStyle } from '../../styles/Buttons.styles';
/* @conditional-compile-remove(end-call-options) */
import { Prompt } from '../Prompt';
/* @conditional-compile-remove(end-call-options) */
import { useLocale } from '../../../localization';

/** @private */
export const EndCall = (props: {
  displayType?: CallControlDisplayType;
  styles?: ControlBarButtonStyles;
  mobileView?: boolean;
  /* @conditional-compile-remove(end-call-options) */
  enableEndCallMenu?: boolean;
  disableEndCallModal?: boolean;
  /* @conditional-compile-remove(breakout-rooms) */
  returnFromBreakoutRoom?: () => Promise<void>;
}): JSX.Element => {
  const compactMode = props.displayType === 'compact';
  const hangUpButtonProps = usePropsFor(EndCallButton);
  /* @conditional-compile-remove(end-call-options) */
  const localeStrings = useLocale().strings;

  /* @conditional-compile-remove(end-call-options) */
  const endCallDiaglogLabels = useMemo(
    () => ({
      confirmButtonLabel: localeStrings.call.endCallConfirmButtonLabel,
      heading: localeStrings.call.endCallConfirmDialogTitle,
      text: localeStrings.call.leaveConfirmDialogContent
    }),
    [
      localeStrings.call.endCallConfirmButtonLabel,
      localeStrings.call.endCallConfirmDialogTitle,
      localeStrings.call.leaveConfirmDialogContent
    ]
  );

  /* @conditional-compile-remove(end-call-options) */
  const leaveDiaglogLabels = useMemo(
    () => ({
      confirmButtonLabel: localeStrings.call.leaveConfirmButtonLabel,
      heading: localeStrings.call.leaveConfirmDialogTitle,
      text: localeStrings.call.leaveConfirmDialogContent
    }),
    [
      localeStrings.call.leaveConfirmButtonLabel,
      localeStrings.call.leaveConfirmDialogContent,
      localeStrings.call.leaveConfirmDialogTitle
    ]
  );

  /* @conditional-compile-remove(end-call-options) */
  const [dialogLabels, setDialogLabels] = useState(leaveDiaglogLabels);

  /* @conditional-compile-remove(end-call-options) */
  const { onHangUp } = hangUpButtonProps;

  /* @conditional-compile-remove(end-call-options) */
  const [showHangUpConfirm, setShowHangUpConfirm] = React.useState(false);

  /* @conditional-compile-remove(end-call-options) */
  const toggleConfirm = useCallback(() => {
    setShowHangUpConfirm(!showHangUpConfirm);
  }, [showHangUpConfirm]);

  /* @conditional-compile-remove(end-call-options) */
  const onHangUpConfirm = useCallback(
    (hangUpForEveryone?: boolean) => {
      onHangUp && onHangUp(hangUpForEveryone);
      toggleConfirm();
    },
    [onHangUp, toggleConfirm]
  );

  /* @conditional-compile-remove(end-call-options) */
  const hangUpOverride = useCallback(
    async (forEveryone?: boolean) => {
      if (
        props.mobileView ||
        forEveryone === false /* value being false(not undefined) because it comes from endCall option */
      ) {
        onHangUp();
        return;
      }
      setDialogLabels(forEveryone ? endCallDiaglogLabels : leaveDiaglogLabels);
      toggleConfirm();
    },
    [endCallDiaglogLabels, leaveDiaglogLabels, onHangUp, props.mobileView, toggleConfirm]
  );

  const styles = useMemo(
    () =>
      concatStyleSets(
        compactMode ? groupCallLeaveButtonCompressedStyle : groupCallLeaveButtonStyle,
        props.styles ?? {}
      ),
    [compactMode, props.styles]
  );

  /* @conditional-compile-remove(breakout-rooms) */
  const enableBreakoutRoomMenu = !!props.returnFromBreakoutRoom;
  /* @conditional-compile-remove(breakout-rooms) */
  const breakoutRoomMenuProps: IContextualMenuProps = {
    items: [
      {
        key: 'returnToMainMeeting',
        text: localeStrings.call.returnFromBreakoutRoomButtonLabel,
        title: localeStrings.call.returnFromBreakoutRoomButtonLabel,
        onClick: () => {
          props.returnFromBreakoutRoom?.();
        }
      },
      {
        key: 'leaveRoomAndMainMeeting',
        text: localeStrings.call.leaveBreakoutRoomAndMeetingButtonLabel,
        title: localeStrings.call.leaveBreakoutRoomAndMeetingButtonLabel,
        onClick: () => onHangUp()
      }
    ],
    styles: props.styles
  };

  return (
    <Stack>
      <EndCallButton
        data-ui-id="call-composite-hangup-button"
        {...hangUpButtonProps}
        /* @conditional-compile-remove(end-call-options) */
        onHangUp={props.disableEndCallModal ? onHangUp : hangUpOverride}
        styles={styles}
        showLabel={!compactMode}
        /* @conditional-compile-remove(end-call-options) */
        enableEndCallMenu={props.enableEndCallMenu ?? false}
        /* @conditional-compile-remove(breakout-rooms) */
        menuProps={enableBreakoutRoomMenu ? breakoutRoomMenuProps : undefined}
      />
      {
        /* @conditional-compile-remove(end-call-options) */
        <Prompt
          {...dialogLabels}
          styles={{ main: { minWidth: '22.5rem', padding: '1.5rem' } }}
          cancelButtonLabel={localeStrings.call.hangUpCancelButtonLabel}
          onConfirm={() => onHangUpConfirm(props.enableEndCallMenu)} // if enableEndCallMenu is true, that means the dialog is triggered by hangUpForEveryone button
          isOpen={showHangUpConfirm}
          onCancel={toggleConfirm}
        />
      }
    </Stack>
  );
};
