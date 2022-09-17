// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { ControlBarButton, ControlBarButtonStyles, useTheme } from '@internal/react-components';
import { concatStyleSets } from '@fluentui/react';
import { CallCompositeIcon } from '../../../common/icons';
import { controlButtonBaseStyle } from '../../styles/Buttons.styles';
import { CallControlOptions } from '../../types/CallControlOptions';
import { useLocale } from '../../../localization/LocalizationProvider';
import { isDisabled } from '../../utils';

const icon = (): JSX.Element => <CallCompositeIcon iconName={'ControlButtonParticipants'} />;

/**
 * @private
 */
export const People = (props: {
  peopleButtonChecked?: boolean;
  onPeopleButtonClicked?: () => void;
  options?: CallControlOptions;
}): JSX.Element => {
  const theme = useTheme();
  const styles: ControlBarButtonStyles = useMemo(
    () =>
      concatStyleSets(
        {
          rootChecked: {
            background: theme.palette.neutralLight
          }
        },
        controlButtonBaseStyle
      ),
    [theme.palette.neutralLight]
  );

  const locale = useLocale();
  // FIXME (?): Why is this using callWithChat strings?
  const strings = useMemo(
    () => ({
      label: locale.strings.callWithChat.peopleButtonLabel,
      tooltipOffContent: locale.strings.callWithChat.peopleButtonTooltipOpen,
      tooltipOnContent: locale.strings.callWithChat.peopleButtonTooltipClose
    }),
    [locale]
  );

  return (
    <ControlBarButton
      data-ui-id="call-composite-participants-button"
      checked={props.peopleButtonChecked}
      showLabel={props.options?.displayType !== 'compact'}
      strings={strings}
      labelKey={'peopleButtonLabelKey'}
      onRenderOnIcon={icon}
      onRenderOffIcon={icon}
      onClick={props.onPeopleButtonClicked}
      styles={styles}
      disabled={isDisabled(props.options?.participantsButton)}
    />
  );
};
