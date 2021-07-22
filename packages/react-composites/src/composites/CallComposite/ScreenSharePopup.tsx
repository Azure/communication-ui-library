// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ContextualMenu, DefaultButton, FocusTrapCallout, IDragOptions, Label, Modal, Stack } from '@fluentui/react';
import { ShareScreenStart20Filled, ShareScreenStop20Filled } from '@fluentui/react-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getScreenSharePopupModalButtonStyles,
  getScreenSharePopupModalStyles,
  screenSharePopupModalLabelStyles,
  screenSharePopupModalStackStyles
} from './styles/ScreenSharePopup.styles';
import { useTheme } from '@internal/react-components';

const STOP_SCREENSHARE_BUTTON_TEXT = 'Stop presenting';
const STOP_SCREENSHARE_LABEL_TEXT = "You're presenting your screen.";
const onRenderStopScreenShareIcon = (): JSX.Element => {
  return <ShareScreenStop20Filled primaryFill="currentColor" />;
};

const DRAG_OPTIONS: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
  keepInBounds: true
};

export interface ScreenSharePopupProps {
  onStopScreenShare: () => Promise<void>;
}

export const ScreenSharePopup = (props: ScreenSharePopupProps): JSX.Element => {
  const { onStopScreenShare } = props;
  const [stoppingInProgress, setStoppingInProgress] = useState(false);

  const theme = useTheme();

  const screenSharePopupModalStylesThemed = useMemo(() => {
    return getScreenSharePopupModalStyles(theme);
  }, [theme]);

  const screenSharePopupModalButtonStylesThemed = useMemo(() => {
    return getScreenSharePopupModalButtonStyles(theme);
  }, [theme]);

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onStopScreenShareClicked = useCallback(async () => {
    setStoppingInProgress(true);
    await onStopScreenShare();
    if (isMounted.current) {
      setStoppingInProgress(false);
    }
  }, [onStopScreenShare]);

  // Beware: The FocusTrapCallout is a workaround to allow users to tab-navigate out of the Modal. There is an open
  // issue here: https://github.com/microsoft/fluentui/issues/18924

  return (
    <>
      <Modal isOpen={true} isModeless={true} dragOptions={DRAG_OPTIONS} styles={screenSharePopupModalStylesThemed}>
        <Stack style={screenSharePopupModalStackStyles} horizontalAlign={'center'}>
          <Stack verticalFill={true} verticalAlign={'center'} horizontalAlign={'center'}>
            <ShareScreenStart20Filled primaryFill="disabled" />
            <Label style={screenSharePopupModalLabelStyles}>{STOP_SCREENSHARE_LABEL_TEXT}</Label>
          </Stack>
          <DefaultButton
            styles={screenSharePopupModalButtonStylesThemed}
            onRenderIcon={onRenderStopScreenShareIcon}
            onClick={onStopScreenShareClicked}
            text={STOP_SCREENSHARE_BUTTON_TEXT}
            disabled={stoppingInProgress}
          />
        </Stack>
        <FocusTrapCallout
          focusTrapProps={{ isClickableOutsideFocusTrap: true, forceFocusInsideTrap: false }}
        ></FocusTrapCallout>
      </Modal>
    </>
  );
};
