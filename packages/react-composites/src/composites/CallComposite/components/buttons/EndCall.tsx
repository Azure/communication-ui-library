// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { concatStyleSets } from '@fluentui/react';
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
}): JSX.Element => {
  const compactMode = props.displayType === 'compact';
  const hangUpButtonProps = usePropsFor(EndCallButton);
  /* @conditional-compile-remove(end-call-options) */
  const localeStrings = useLocale().strings;

  /* @conditional-compile-remove(end-call-options) */
  const { onHangUp, enableEndCallMenu } = hangUpButtonProps;

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
      forEveryone
        ? setPromptHeading(localeStrings.call.endCallConfirmDialogTitle)
        : setPromptHeading(localeStrings.call.leaveConfirmDialogTitle);
      forEveryone
        ? setPromptText(localeStrings.call.endCallConfirmDialogContent)
        : setPromptText(localeStrings.call.leaveConfirmDialogContent);
      toggleConfirm();
    },
    [
      localeStrings.call.endCallConfirmDialogContent,
      localeStrings.call.endCallConfirmDialogTitle,
      localeStrings.call.leaveConfirmDialogContent,
      localeStrings.call.leaveConfirmDialogTitle,
      onHangUp,
      props.mobileView,
      toggleConfirm
    ]
  );

  /* @conditional-compile-remove(end-call-options) */
  const [promptHeading, setPromptHeading] = useState<string>();
  /* @conditional-compile-remove(end-call-options) */
  const [promptText, setPromptText] = useState<string>();

  const styles = useMemo(
    () =>
      concatStyleSets(
        compactMode ? groupCallLeaveButtonCompressedStyle : groupCallLeaveButtonStyle,
        props.styles ?? {}
      ),
    [compactMode, props.styles]
  );
  return (
    <>
      {
        /* @conditional-compile-remove(end-call-options) */
        <Prompt
          heading={promptHeading}
          text={promptText}
          confirmButtonLabel={localeStrings.call.hangUpConfirmButtonLabel}
          cancelButtonLabel={localeStrings.call.hangUpCancelButtonLabel}
          onConfirm={() => onHangUpConfirm(enableEndCallMenu)} // if enableEndCallMenu is true, that means the dialog is triggered by hangUpForEveryone button
          isOpen={showHangUpConfirm}
          onCancel={toggleConfirm}
        />
      }
      <EndCallButton
        data-ui-id="call-composite-hangup-button"
        {...hangUpButtonProps}
        /* @conditional-compile-remove(end-call-options) */
        onHangUp={hangUpOverride}
        styles={styles}
        showLabel={!compactMode}
        /* @conditional-compile-remove(end-call-options) */
        enableEndCallMenu={props.enableEndCallMenu ?? false}
      />
    </>
  );
};
