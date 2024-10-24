// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rtt) */
import { mergeStyles, Theme } from '@fluentui/react';
/* @conditional-compile-remove(rtt) */
import { _pxToRem } from '@internal/acs-ui-common';

/* @conditional-compile-remove(rtt) */
/**
 * @private
 */
export const bannerContentStyles = (theme: Theme): string =>
  mergeStyles({
    fontWeight: 400,
    fontSize: _pxToRem(14),
    lineHeight: _pxToRem(16),
    color: theme.palette.neutralSecondary
  });

/* @conditional-compile-remove(rtt) */
/**
 * @private
 */
export const bannerLinkStyles = (theme: Theme): string =>
  mergeStyles({
    color: theme.palette.themePrimary,
    fontWeight: '600',
    paddingLeft: '0.25rem'
  });
/* @conditional-compile-remove(rtt) */
/**
 * @private
 */
export const bannerContainerStyles = (): string =>
  mergeStyles({
    borderRadius: '0.375rem',
    padding: '1rem',
    gap: '0.25rem',
    marginBottom: '2rem',
    boxShadow: '0px 1.2px 3.6px 0px #0000001A'
  });

/* @conditional-compile-remove(rtt) */
/**
 * @private
 */
export const bannerTitleClassName = mergeStyles({
  fontWeight: 400,
  fontSize: _pxToRem(14),
  lineHeight: _pxToRem(20),
  paddingLeft: '0.25rem'
});
