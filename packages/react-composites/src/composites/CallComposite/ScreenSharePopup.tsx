// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ContextualMenu,
  DefaultButton,
  FocusTrapCallout,
  Icon,
  IDragOptions,
  Label,
  Modal,
  Stack
} from '@fluentui/react';
import { useTheme } from '@internal/react-components';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getScreenSharePopupModalButtonStyles,
  getScreenSharePopupModalStyles,
  screenSharePopupModalLabelStyles,
  screenSharePopupModalStackStyles
} from './styles/ScreenSharePopup.styles';

const STOP_SCREENSHARE_BUTTON_TEXT = 'Stop presenting';
const STOP_SCREENSHARE_LABEL_TEXT = "You're presenting your screen.";
const onRenderStopScreenShareIcon = (): JSX.Element => {
  return <Icon iconName="ScreenSharePopupStopPresenting" />;
};

const DRAG_OPTIONS: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
  keepInBounds: true
};

export interface ScreenSharePopupProps {
  onStopScreenShare: () => Promise<void>;

  /**
   * ID of the react element to host the screenshare modal window in.
   * If this is not supplied the modal dialog is hosted in a fixed
   * position element rendered at the end of the document.
   *
   * {@link https://docs.microsoft.com/javascript/api/react-internal/ilayerprops?view=office-ui-fabric-react-latest#hostId}
   */
  hostId?: string;
}

export const ScreenSharePopup = (props: ScreenSharePopupProps): JSX.Element => {
  const { hostId, onStopScreenShare } = props;
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

  return (
    <Modal
      layerProps={hostId ? { hostId } : undefined}
      isOpen={true}
      isModeless={true}
      dragOptions={DRAG_OPTIONS}
      styles={screenSharePopupModalStylesThemed}
    >
      <Stack style={screenSharePopupModalStackStyles} horizontalAlign={'center'}>
        <Stack verticalFill={true} verticalAlign={'center'} horizontalAlign={'center'}>
          <Icon iconName="ScreenSharePopupPresenting" />
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
      {/*
        The FocusTrapCallout is a workaround to allow users to tab-navigate out of the Modal. There is an open
        issue here: https://github.com/microsoft/fluentui/issues/18924
      */}
      <FocusTrapCallout
        focusTrapProps={{ isClickableOutsideFocusTrap: true, forceFocusInsideTrap: false }}
      ></FocusTrapCallout>
    </Modal>
  );
};
