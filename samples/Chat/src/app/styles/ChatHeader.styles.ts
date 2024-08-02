// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, IIconProps, mergeStyles } from '@fluentui/react';

export const chatHeaderContainerStyle = mergeStyles({
  position: 'absolute',
  alignSelf: 'flex-end',
  minHeight: '2.5rem',
  width: '100%',
  height: 'auto',
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem'
});

export const leaveButtonStyle = mergeStyles({
  marginRight: '0.625rem',
  width: '7rem',
  borderWidth: '2px',
  fontSize: '16px', // 14px
  fontWeight: 600,
  borderRadius: '6px'
});

export const copilotIconStyle = mergeStyles({
  background:
    'radial-gradient(circle at 100% 100%, #ffffff 0, #ffffff 5px, transparent 5px) 0% 0%/6px 6px no-repeat,radial-gradient(circle at 0 100%, #ffffff 0, #ffffff 5px, transparent 5px) radial-gradient(circle at 100% 0, #ffffff 0, #ffffff 5px, transparent 5px) 0% 100%/6px 6px no-repeat, radial-gradient(circle at 0 0, #ffffff 0, #ffffff 5px, transparent 5px) 100% 100%/6px 6px no-repeat, linear-gradient(#ffffff, #ffffff) 50% 50%/calc(100% - 2px) calc(100% - 12px) no-repeat, linear-gradient(#ffffff, #ffffff) 50% 50%/calc(100% - 12px) calc(100% - 2px) no-repeat, linear-gradient(129deg, #239bf5 0%, rgba(19,227,217,1) 24%, rgba(233,227,26,1) 52%, #e9459b 85%);'
});

export const greyIconButtonStyle = mergeStyles({
  marginRight: '0.5rem'
});

export const leaveIcon: IIconProps = {
  iconName: 'Leave'
};

export const paneButtonContainerStyle = mergeStyles({
  whiteSpace: 'nowrap',
  marginRight: '0.75rem'
});

export const largeLeaveButtonContainerStyle = mergeStyles({
  whiteSpace: 'nowrap',
  '@media (max-width: 50rem)': {
    display: 'none'
  }
});

export const buttonWithIconStyles: IButtonStyles = {
  textContainer: {
    display: 'contents'
  }
};

export const smallLeaveButtonContainerStyle = mergeStyles({
  whiteSpace: 'nowrap',
  '@media (min-width: 50rem)': {
    display: 'none'
  }
});

export const leaveIconStyle = mergeStyles({
  marginRight: '0.5em',
  fontSize: '0.875rem' // 14px
});
