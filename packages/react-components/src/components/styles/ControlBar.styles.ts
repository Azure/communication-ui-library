// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, IButtonStyles, IContextualMenuStyles, IContextualMenuItemStyles } from '@fluentui/react';
import { ParticipantListStyles } from '../ParticipantList';

interface IControlBarStyles {
  horizontal: IStyle;
  vertical: IStyle;
  dockedTop: IStyle;
  dockedBottom: IStyle;
  dockedLeft: IStyle;
  dockedRight: IStyle;
  floatingTop: IStyle;
  floatingBottom: IStyle;
  floatingLeft: IStyle;
  floatingRight: IStyle;
}

/**
 * @private
 */
export const controlBarStyles: IControlBarStyles = {
  horizontal: {
    flexFlow: 'row nowrap'
  },
  vertical: {
    flexFlow: 'column nowrap',
    maxWidth: '3.5rem'
  },
  dockedTop: {
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    minWidth: 'fit-content'
  },
  dockedBottom: {
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    minWidth: 'fit-content'
  },
  dockedLeft: {
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%'
  },
  dockedRight: {
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%'
  },
  floatingTop: {
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    minWidth: 'fit-content',
    zIndex: 10
  },
  floatingBottom: {
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    bottom: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    minWidth: 'fit-content',
    zIndex: 10
  },
  floatingLeft: {
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: '50%',
    left: '1rem',
    transform: 'translateY(-50%)',
    zIndex: 10
  },
  floatingRight: {
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: '50%',
    right: '1rem',
    transform: 'translateY(-50%)',
    zIndex: 10
  }
};

/**
 * @private
 */
export const controlButtonStyles: IButtonStyles = {
  root: {
    background: 'none',
    border: 'none',
    borderRadius: 0,
    minHeight: '3.5rem',
    minWidth: '3.5rem',
    svg: {
      verticalAlign: 'text-top'
    }
  },
  flexContainer: {
    flexFlow: 'column',
    display: 'contents'
  }
};

/**
 * @private
 */
export const controlButtonLabelStyles: IStyle = {
  fontSize: '0.625rem',
  lineHeight: '1rem',
  cursor: 'pointer',
  display: 'block',
  margin: '0rem 0.25rem'
};

/**
 * making it Partial as IContextualMenuStyles has all its props non-optional and we only need title to be defined here.
 *
 * @private
 */
export const participantsButtonMenuPropsStyle: Partial<IContextualMenuStyles> = {
  title: {
    background: 'initial',
    paddingLeft: '.5rem',
    fontWeight: 600,
    fontSize: '.75rem'
  }
};

/**
 * @private
 */
export const defaultParticipantListContainerStyle: ParticipantListStyles = {
  root: {
    maxHeight: '20rem'
  }
};

/**
 * Default styles for button flyout items
 *
 * @private
 */
export const buttonFlyoutItemStyles: IContextualMenuItemStyles = {
  icon: {
    lineHeight: 0
  },
  checkmarkIcon: {
    lineHeight: 0
  }
};
