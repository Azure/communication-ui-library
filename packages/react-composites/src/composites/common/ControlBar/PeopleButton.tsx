// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useMemo, RefObject, useRef } from 'react';
import {
  ControlBarButton,
  ControlBarButtonProps,
  ControlBarButtonStyles,
  useAccessibility,
  useTheme
} from '@internal/react-components';
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
  const theme = useTheme();
  const accessibility = useAccessibility();
  const peopleButtonRef = useRef<IButton | null>(null);
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
      if (event.key === 'Tab' && !event.shiftKey && peoplePaneDismissButtonRef?.current && !chatButtonPresent) {
        peoplePaneDismissButtonRef.current.focus();
        event.preventDefault();
      }
    },
    [peoplePaneDismissButtonRef, chatButtonPresent]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      if (chatButtonPresent) {
        peoplePaneDismissButtonRef?.current?.focus();
        event.preventDefault();
      }
    },
    [chatButtonPresent, onClick, peoplePaneDismissButtonRef]
  );

  return (
    <ControlBarButton
      {...props}
      strings={strings}
      labelKey={'peopleButtonLabelKey'}
      onRenderOnIcon={onRenderOnIcon ?? icon}
      onRenderOffIcon={onRenderOffIcon ?? icon}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        accessibility.setComponentRef(peopleButtonRef.current);
        handleClick(event);
      }}
      onKeyDown={handleTab}
      styles={styles}
      componentRef={peopleButtonRef}
    />
  );
};
