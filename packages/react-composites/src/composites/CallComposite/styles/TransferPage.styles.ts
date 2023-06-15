// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IPersonaStyleProps, IPersonaStyles, IStyle, IStyleFunctionOrObject } from '@fluentui/react';

/**
 * @private
 */
export const avatarStyles: IStyle = { opacity: 0.4 };

/**
 * @private
 */
export const tileContainerStyles: IStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  minWidth: '100%',
  minHeight: '100%',
  objectPosition: 'center',
  objectFit: 'cover',
  zIndex: 0
};

/**
 * @private
 */
export const tileContentStyles: IStyle = {
  width: '100%',
  position: 'absolute',
  top: '50%',
  transform: 'translate(0, -50%)',
  display: 'flex',
  justifyContent: 'center'
};

/**
 * @private
 */
export const defaultPersonaStyles: IStyleFunctionOrObject<IPersonaStyleProps, IPersonaStyles> = {
  root: { margin: 'auto' }
};

/**
 * @private
 */
export const displayNameStyles: IStyle = { textAlign: 'center', fontSize: '1.5rem', fontWeight: 400 };

/**
 * @private
 */
export const spinnerStyles: IStyle = { circle: { borderWidth: '0.125rem' } };

/**
 * @private
 */
export const statusTextStyles: IStyle = { textAlign: 'center', fontSize: '1rem' };
