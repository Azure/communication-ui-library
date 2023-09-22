// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
/* @conditional-compile-remove(call-readiness) */
import { useMemo } from 'react';
/* @conditional-compile-remove(call-readiness) */
import { Stack, Text, Link, PrimaryButton, mergeStyleSets, useTheme, Image, ImageFit } from '@fluentui/react';
/* @conditional-compile-remove(call-readiness) */
import { useLocale } from '../../localization';
/* @conditional-compile-remove(call-readiness) */
import { _formatString, _pxToRem } from '@internal/acs-ui-common';
/* @conditional-compile-remove(call-readiness) */
import {
  browserPermissionContainerStyles,
  iOSImageContainer,
  iOSStepsCircleStyles,
  iOSStepsContainerStyles,
  iOSStepsDigitTextStyles,
  iOSStepsTextStyles,
  linkTextStyles,
  primaryButtonStyles,
  primaryTextStyles,
  secondaryTextStyles,
  textContainerStyles
} from './../styles/BrowserPermissionDenied.styles';
import { BrowserPermissionDeniedProps, BrowserPermissionDeniedStrings } from './BrowserPermissionDenied';
/* @conditional-compile-remove(call-readiness) */
import { isValidString } from '../utils';

/**
 * @beta
 * Props for BrowserPermissionDeniedIOS component.
 */
export interface BrowserPermissionDeniedIOSProps extends BrowserPermissionDeniedProps {
  /**
   * Localization strings for BrowserPermissionDeniedIOS component.
   */
  strings?: BrowserPermissionDeniedIOSStrings;
  /**
   * Link to image source.
   *
   * Image is inserted into the top of the component.
   */
  imageSource?: string;
}

/**
 * @beta
 * Strings for BrowserPermissionDeniedIOS component
 */
export interface BrowserPermissionDeniedIOSStrings extends BrowserPermissionDeniedStrings {
  /**
   * Image alt text
   */
  imageAltText: string;
  /**
   * Main text string.
   */
  primaryText: string;
  /**
   * Subtext string.
   */
  secondaryText: string;
  /**
   * Step 1 string
   */
  step1Text: string;
  /**
   * Step 1 digit string
   */
  step1DigitText: string;
  /**
   * Step 2 string
   */
  step2Text: string;
  /**
   * Step 2 digit string
   */
  step2DigitText: string;
  /**
   * Step 3 string
   */
  step3Text: string;
  /**
   * Step 3 digit string
   */
  step3DigitText: string;
  /**
   * Step 4 string
   */
  step4Text: string;
  /**
   * Step 4 digit string
   */
  step4DigitText: string;
}

/* @conditional-compile-remove(call-readiness) */
const BrowserPermissionDeniedIOSContainer = (props: BrowserPermissionDeniedIOSProps): JSX.Element => {
  const { imageSource, onTroubleshootingClick, onTryAgainClick, strings, styles } = props;
  const theme = useTheme();

  const stepsCircleStyle = useMemo(() => {
    return mergeStyleSets(iOSStepsCircleStyles, { root: { background: theme.palette.neutralLighter } });
  }, [theme]);

  return (
    <Stack styles={browserPermissionContainerStyles}>
      {imageSource && (
        <Stack styles={mergeStyleSets(iOSImageContainer, { root: { background: theme.palette.neutralLighter } })}>
          {isValidString(strings?.imageAltText) && (
            <Image
              src={imageSource ?? ''}
              alt={strings?.imageAltText}
              imageFit={ImageFit.centerContain}
              style={{ padding: '1.5rem' }}
            />
          )}
        </Stack>
      )}
      <Stack style={{ padding: '1rem', paddingBottom: '1.25rem' }}>
        <Stack styles={textContainerStyles}>
          {isValidString(strings?.primaryText) && <Text styles={primaryTextStyles}>{strings?.primaryText}</Text>}
          {isValidString(strings?.secondaryText) && <Text styles={secondaryTextStyles}>{strings?.secondaryText}</Text>}
          {isValidString(strings?.step1Text) && (
            <Stack styles={iOSStepsContainerStyles}>
              <Stack horizontalAlign={'center'} styles={stepsCircleStyle}>
                <Text styles={iOSStepsDigitTextStyles}>{strings?.step1DigitText}</Text>
              </Stack>
              <Text styles={iOSStepsTextStyles}>{strings?.step1Text}</Text>
            </Stack>
          )}
          {isValidString(strings?.step2Text) && (
            <Stack styles={iOSStepsContainerStyles}>
              <Stack horizontalAlign={'center'} styles={stepsCircleStyle}>
                <Text styles={iOSStepsDigitTextStyles}>{strings?.step2DigitText}</Text>
              </Stack>
              <Text styles={iOSStepsTextStyles}>{strings?.step2Text}</Text>
            </Stack>
          )}
          {isValidString(strings?.step3Text) && (
            <Stack styles={iOSStepsContainerStyles}>
              <Stack horizontalAlign={'center'} styles={stepsCircleStyle}>
                <Text styles={iOSStepsDigitTextStyles}>{strings?.step3DigitText}</Text>
              </Stack>
              <Text styles={iOSStepsTextStyles}>{strings?.step3Text}</Text>
            </Stack>
          )}
          {isValidString(strings?.step4Text) && (
            <Stack styles={mergeStyleSets(iOSStepsContainerStyles, { root: { paddingBottom: '1.5rem' } })}>
              <Stack horizontalAlign={'center'} styles={stepsCircleStyle}>
                <Text styles={iOSStepsDigitTextStyles}>{strings?.step4DigitText}</Text>
              </Stack>
              <Text styles={iOSStepsTextStyles}>{strings?.step4Text}</Text>
            </Stack>
          )}
          {isValidString(strings?.primaryButtonText) && (
            <PrimaryButton
              styles={mergeStyleSets(primaryButtonStyles, styles?.primaryButton)}
              text={strings?.primaryButtonText}
              onClick={onTryAgainClick}
            />
          )}
          {isValidString(strings?.linkText) && (
            <Link styles={mergeStyleSets(linkTextStyles, styles?.troubleshootingLink)} onClick={onTroubleshootingClick}>
              {strings?.linkText}
            </Link>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

/**
 * @beta
 *
 * Component to allow Contoso to help their end user with their devices should their browser experience device permission issues.
 */
export const BrowserPermissionDeniedIOS = (props: BrowserPermissionDeniedIOSProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const locale = useLocale().strings.BrowserPermissionDeniedIOS;
  /* @conditional-compile-remove(call-readiness) */
  return <BrowserPermissionDeniedIOSContainer {...props} strings={props.strings ? props.strings : locale} />;
  return <></>;
};
