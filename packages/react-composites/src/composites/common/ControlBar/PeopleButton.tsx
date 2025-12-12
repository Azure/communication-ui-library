// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useMemo, RefObject, useState } from 'react';
import { ControlBarButton, ControlBarButtonProps, ControlBarButtonStyles, useTheme } from '@internal/react-components';
import { concatStyleSets, IButton } from '@fluentui/react';
import { CallCompositeIcon } from '../icons';

const icon = (): JSX.Element => <CallCompositeIcon iconName={'ControlBarPeopleButton'} />;

/**
 * @private
 * props for the PeopleButton component
 */
export interface PeopleButtonProps extends ControlBarButtonProps {
  peoplePaneDismissButtonRef?: RefObject<IButton>;
  chatButtonPresent?: boolean;
}

/**
 * @private
 */
export const PeopleButton = (props: PeopleButtonProps): JSX.Element => {
  const { strings, onRenderOnIcon, onRenderOffIcon, onClick, peoplePaneDismissButtonRef, chatButtonPresent } = props;
  const [buttonOpen, setButtonOpen] = useState<boolean>(false);
  const theme = useTheme();
  const styles: ControlBarButtonStyles = useMemo(
    () =>
      concatStyleSets(
        {
          rootChecked: {
            background: theme.palette.neutralLight
          }
        },
        props.styles ?? {}
      ),
    [props.styles, theme.palette.neutralLight]
  );

  const handleTab = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if((event.key === "Tab" || event.code === "Tab" && buttonOpen) && !chatButtonPresent) {
        event.preventDefault();
        if(peoplePaneDismissButtonRef?.current) {
          peoplePaneDismissButtonRef.current.focus();
        }
        return;
      }
      if (event.key === 'Space' || event.key === 'Enter') {
        setButtonOpen(!buttonOpen);
      }
    },
    [peoplePaneDismissButtonRef, chatButtonPresent, buttonOpen, setButtonOpen, chatButtonPresent]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      setButtonOpen(!buttonOpen);
      if (chatButtonPresent) {
        peoplePaneDismissButtonRef?.current?.focus();
        event.preventDefault();
      }
    },
    [chatButtonPresent, onClick, peoplePaneDismissButtonRef, buttonOpen, setButtonOpen]
  );

  return (
    <ControlBarButton
      {...props}
      strings={strings}
      labelKey={'peopleButtonLabelKey'}
      onRenderOnIcon={onRenderOnIcon ?? icon}
      onRenderOffIcon={onRenderOffIcon ?? icon}
      onClick={handleClick}
      onKeyDown={handleTab}
      styles={styles}
    />
  );
};
