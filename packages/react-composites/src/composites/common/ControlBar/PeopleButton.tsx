// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useMemo, useRef, RefObject } from 'react';
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
}

/**
 * @private
 */
export const PeopleButton = (props: PeopleButtonProps): JSX.Element => {
  const { strings, onRenderOnIcon, onRenderOffIcon, onClick, peoplePaneDismissButtonRef } = props;
  const theme = useTheme();
  const peopleButtonRef = useRef<IButton>(null);
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
      console.log('event.key', event.key);
      if (event.key === 'Tab' && !event.shiftKey && peoplePaneDismissButtonRef?.current) {
        console.log(peoplePaneDismissButtonRef?.current);
        peoplePaneDismissButtonRef.current.focus();
        event.preventDefault();
      }
    },
    [peoplePaneDismissButtonRef]
  );

  return (
    <ControlBarButton
      {...props}
      componentRef={peopleButtonRef}
      strings={strings}
      labelKey={'peopleButtonLabelKey'}
      onRenderOnIcon={onRenderOnIcon ?? icon}
      onRenderOffIcon={onRenderOffIcon ?? icon}
      onClick={(event) => {
        onClick?.(event);
        peopleButtonRef.current?.focus();
      }}
      onKeyDown={handleTab}
      styles={styles}
    />
  );
};
