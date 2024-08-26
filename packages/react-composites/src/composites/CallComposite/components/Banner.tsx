// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DefaultButton, Theme, mergeStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
// eslint-disable-next-line no-restricted-imports
import { IIconProps, Icon, PrimaryButton, Stack, Text, useTheme } from '@fluentui/react';
import React from 'react';

/**
 * Props for {@link Banner}.
 *
 * @private
 */
export interface BannerProps {
  /**
   * Banner strings.
   */
  strings?: BannerStrings;

  /**
   * Banner icon.
   */
  iconProps?: IIconProps;

  /**
   * Callback called when the button inside banner is clicked.
   */
  onClickButton?: () => void;

  /**
   * If true, the primary button will be styled as a primary button. Default is false.
   */
  primaryButton?: boolean;
}

/**
 * All strings that may be shown on the UI in the {@link Banner}.
 *
 * @private
 */
export interface BannerStrings {
  /**
   * Banner title.
   */
  title: string;
  /**
   * Banner primary button label.
   */
  primaryButtonLabel: string;
}

/**
 * A component to show a banner in the UI.
 *
 * @private
 */
export const Banner = (props: BannerProps): JSX.Element => {
  const strings = props.strings;
  const theme = useTheme();

  return (
    <Stack horizontalAlign="center">
      <Stack data-ui-id="banner" className={containerStyles(theme)}>
        <Stack horizontal horizontalAlign="space-between">
          <Stack horizontal>
            {props.iconProps?.iconName && (
              <Icon className={bannerIconClassName} iconName={props.iconProps?.iconName} {...props.iconProps} />
            )}
            <Text className={titleTextClassName}>{strings?.title}</Text>
          </Stack>
          {props.primaryButton ? (
            <PrimaryButton
              text={strings?.primaryButtonLabel}
              ariaLabel={strings?.primaryButtonLabel}
              onClick={props.onClickButton}
            />
          ) : (
            <DefaultButton
              text={strings?.primaryButtonLabel}
              ariaLabel={strings?.primaryButtonLabel}
              onClick={props.onClickButton}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

const titleTextClassName = mergeStyles({
  fontWeight: 400,
  fontSize: _pxToRem(14),
  lineHeight: _pxToRem(16),
  alignSelf: 'center'
});

const containerStyles = (theme: Theme): string =>
  mergeStyles({
    boxShadow: theme.effects.elevation8,
    width: '20rem',
    padding: '0.75rem',
    borderRadius: '0.25rem',
    position: 'relative',
    backgroundColor: theme.palette.white
  });

const bannerIconClassName = mergeStyles({
  fontSize: '1.25rem',
  alignSelf: 'center',
  marginRight: '0.5rem',
  svg: {
    width: '1.25rem',
    height: '1.25rem'
  }
});
