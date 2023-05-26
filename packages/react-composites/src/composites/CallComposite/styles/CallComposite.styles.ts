// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles, IStyle, mergeStyles } from '@fluentui/react';

const DEFAULT_Z_INDEX = 1;

const mainScreenContainerStyle: IStyle = {
  height: '100%',
  width: '100%'
};

/**
 * @private
 */
export const mainScreenContainerStyleDesktop = mergeStyles({
  ...mainScreenContainerStyle,
  minWidth: '30rem', // max of min-width of composite pages (Call page)
  minHeight: '22rem' // max height of min-height of composite pages (Configuration page)
});

/**
 * @private
 */
export const mainScreenContainerStyleMobile = mergeStyles({
  ...mainScreenContainerStyle,
  minWidth: '17.5rem', // max of min-width of composite pages (Call page)
  minHeight: '13rem' // max height of min-height of composite pages (Configuration page & Call page)
});

/**
 * @private
 * Drawer styles to be used to house the _DrawerComponent on top of other content on the screen.
 * @param zIndex: this defaults to DEFAULT_Z_INDEX if unset
 */
export const drawerContainerStyles = (zIndex: number = DEFAULT_Z_INDEX): IStackStyles => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // Any zIndex > 0 will work because this is the only absolutely
    // positioned element in the container.
    zIndex: zIndex
  }
});

/**
 * @private
 * Page container style for leaving page
 */
export const leavingPageStyle: IStyle = {
  background: '#FAF9F8'
};
