// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(rtt) */
import { mergeStyles } from '@fluentui/react';
/* @conditional-compile-remove(rtt) */
/**
 * @private
 */
export const bannerLinkStyles = (): string =>
  mergeStyles({
    color: '#004173',
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
    gap: '1rem',
    marginBottom: '2rem',
    boxShadow: '0px 1.2px 3.6px 0px #0000001A'
  });
