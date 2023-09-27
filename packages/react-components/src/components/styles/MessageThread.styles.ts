// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, mergeStyles } from '@fluentui/react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { CSSProperties } from 'react';
import { MESSAGE_STATUS_INDICATOR_SIZE_REM } from './MessageStatusIndicator.styles';
import { ComponentSlotStyle } from '../../types';

// Minimum chat bubble width. This matches the minimum chat bubble width from FluentUI
// that can contain a message and a timestamp.
const CHAT_MESSAGE_CONTAINER_MIN_WIDTH_REM = 6.25;

// Chat messages should span just short of the width of the container.
// When calculating the width of a message we also must take into account
// the width of the avatar/gutter and the gap between the message and avatar/gutter.
const AVATAR_WIDTH_REM = 2;
const AVATAR_MARGIN_LEFT = 2.5;
const AVATAR_MESSAGE_GAP_REM = 0.125;
const MESSAGE_AMOUNT_OUT_FROM_EDGE_REM = 2;

// Avatars should display on top of chat messages when the chat thread is narrow
const MESSAGE_AVATAR_OVERLAP_REM = 0.925;
const CHAT_MESSAGE_ZINDEX = 1;
const AVATAR_ZINDEX = 2;
// new message button should be on top of chat message
const NEW_MESSAGE_BUTTON_ZINDEX = 2;

/**
 * @private
 */
export const messageThreadContainerStyle = mergeStyles({
  height: '100%',
  width: '100%',
  maxHeight: '100%',
  overflow: 'auto',
  position: 'relative',
  alignSelf: 'center'
});

/**
 * @private
 */
export const noMessageStatusStyle = mergeStyles({
  // This should match the size of the message status indicator icon to ensure
  // multiple messages sent by the user are aligned correctly.
  width: `${MESSAGE_STATUS_INDICATOR_SIZE_REM}rem`
});

/**
 * @private
 */
export const useChatStyles = makeStyles({
  root: {
    paddingTop: '0.8rem',
    paddingBottom: '0.5rem',
    paddingRight: '0.6rem',
    paddingLeft: '0.6rem',
    ...shorthands.border('none'),
    ...shorthands.overflow('auto'),
    // `height: 100%` ensures that the Chat component covers 100% of it's parents height
    // to prevent intermittent scrollbars when GIFs are present in the chat.
    height: '100%',

    '& a:link': {
      color: tokens.colorBrandForegroundLink
    },
    '& a:visited': {
      color: tokens.colorBrandForegroundLinkHover
    },
    '& a:hover': {
      color: tokens.colorBrandForegroundLinkHover
    }
  }
});

/**
 * @private
 */
export const useChatMessageRenderStyles = makeStyles({
  rootMessage: {
    ...shorthands.padding('0'),
    ...shorthands.margin('0'),
    maxWidth: '100%',
    minWidth: `${CHAT_MESSAGE_CONTAINER_MIN_WIDTH_REM}rem`
  },
  rootMyMessage: {
    gridTemplateColumns: 'auto fit-content(0)',
    gridTemplateAreas: `
        "body status"
      `,
    columnGap: '0',
    gridGap: '0',
    ...shorthands.padding('0'),
    marginTop: '0',
    marginRight: '0',
    marginBottom: '0',
    marginLeft: '50px',
    width: `calc(100% - 50px)`
  },
  bodyCommon: {
    ...shorthands.padding('0'),
    marginRight: '0',
    marginBottom: '0',
    backgroundColor: 'transparent',
    maxWidth: '100%',
    minWidth: `${CHAT_MESSAGE_CONTAINER_MIN_WIDTH_REM}rem`
  },
  bodyMyMessage: {
    width: '100%',
    marginTop: '0'
  },
  bodyWithoutAvatar: {
    marginLeft: `${AVATAR_MARGIN_LEFT}rem`,
    marginTop: '0'
  },
  bodyWithAvatar: {
    marginLeft: `0`,
    marginTop: '0.75rem'
  },
  avatarNoOverlap: {
    width: `calc(100% - ${AVATAR_WIDTH_REM + MESSAGE_AMOUNT_OUT_FROM_EDGE_REM + AVATAR_MESSAGE_GAP_REM}rem)`
  },
  avatarOverlap: {
    width: `calc(100% - ${AVATAR_WIDTH_REM + MESSAGE_AMOUNT_OUT_FROM_EDGE_REM - MESSAGE_AVATAR_OVERLAP_REM}rem)`
  }
});

/**
 * @private
 */
export const useChatMyMessageStyles = makeStyles({
  root: {
    gridTemplateColumns: 'auto auto',
    gridTemplateAreas: `
        ". actions"
        "body body"
      `,
    gridGap: '0',
    columnGap: '0',
    paddingTop: '0',
    marginLeft: '0'
  },
  body: {
    paddingBottom: '10px',
    maxWidth: '100%',
    minWidth: `${CHAT_MESSAGE_CONTAINER_MIN_WIDTH_REM}rem`,
    marginLeft: '0rem',
    // This makes message bubble show border in high contrast mode making each message distinguishable
    ...shorthands.border('1px', 'solid', 'transparent'),

    '&:hover ~ .fui-ChatMyMessage__actions': {
      visibility: 'visible'
    },
    '&:focus ~ .fui-ChatMyMessage__actions': {
      visibility: 'visible'
    },
    '& msft-mention': {
      color: '#D83B01',
      fontWeight: 600
    }
  },
  menu: {
    boxShadow: tokens.shadow4,
    backgroundColor: tokens.colorNeutralBackground1,
    marginBottom: '-10px',
    marginRight: '1px',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    zIndex: 1,
    lineHeight: tokens.lineHeightBase100,
    visibility: 'hidden',

    '&:hover, &:focus': {
      cursor: 'pointer',
      visibility: 'visible'
    }
  },
  menuHidden: {
    visibility: 'hidden'
  },
  menuVisible: {
    visibility: 'visible'
  }
});

/**
 * @private
 */
export const newMessageButtonContainerStyle = mergeStyles({
  position: 'absolute',
  zIndex: NEW_MESSAGE_BUTTON_ZINDEX,
  bottom: 0,
  right: '1.5rem'
});

/**
 * @private
 */
export const chatMessageDateStyle: CSSProperties = {
  fontWeight: 600
};

/**
 * @private
 */
export const useChatMessageStyles = makeStyles({
  root: {
    paddingTop: '0'
  },
  body: {
    maxWidth: '100%',
    minWidth: `${CHAT_MESSAGE_CONTAINER_MIN_WIDTH_REM}rem`,
    marginRight: '0rem',
    paddingBottom: '10px',
    zIndex: CHAT_MESSAGE_ZINDEX,
    // This makes message bubble show border in high contrast mode making each message distinguishable
    ...shorthands.border('1px', 'solid', 'transparent'),
    '& > div:first-of-type': {
      flexWrap: 'wrap'
    },
    '& msft-mention': {
      color: tokens.colorStatusWarningBackground3,
      fontWeight: tokens.fontWeightSemibold
    },
    '& img': {
      maxWidth: '100% !important', // Add !important to make sure it won't be overridden by style defined in element
      height: 'auto !important'
    },
    '& video': {
      maxWidth: '100% !important', // Add !important to make sure it won't be overridden by style defined in element
      height: 'auto !important'
    },
    '& p': {
      // Deal with awkward padding seen in messages from Teams.
      // For more info see https://github.com/Azure/communication-ui-library/pull/1507
      ...shorthands.marginBlock('0.125rem')
    },
    '& blockquote': {
      backgroundColor: tokens.colorBrandBackgroundInverted,
      clear: 'left',
      minHeight: '2.25rem',
      width: 'fit-content',
      marginTop: '7px',
      marginRight: '0px',
      marginLeft: '0px',
      marginBottom: '7px',
      paddingTop: '7px',
      paddingRight: '15px',
      paddingLeft: '15px',
      paddingBottom: '7px',
      ...shorthands.border('solid'),
      ...shorthands.borderRadius('4px'),
      ...shorthands.borderWidth('1px'),
      ...shorthands.borderColor(tokens.colorNeutralStroke1Selected),
      borderLeftWidth: '4px'
    },
    '& table': {
      backgroundColor: tokens.colorBrandBackgroundInverted,
      ...shorthands.borderColor(tokens.colorNeutralStroke1Selected),
      borderCollapse: 'collapse',
      tableLayout: 'auto',
      width: '100%',

      '& tr': {
        ...shorthands.border('1px', 'solid', `${tokens.colorNeutralStroke1Selected}`),

        '& td': {
          ...shorthands.border('1px', 'solid', `${tokens.colorNeutralStroke1Selected}`),
          wordBreak: 'normal',
          paddingTop: '0px',
          paddingRight: '5px'
        }
      }
    }
  },
  bodyWithoutAvatar: {
    marginTop: '0.125rem'
  },
  bodyWithAvatar: {
    marginTop: `0.5rem`
  },
  avatarNoOverlap: {
    marginLeft: `${-AVATAR_MARGIN_LEFT + AVATAR_MESSAGE_GAP_REM}rem`
  },
  avatarOverlap: {
    marginLeft: `${-AVATAR_MARGIN_LEFT - MESSAGE_AVATAR_OVERLAP_REM}rem`
  }
});

/**
 * @private
 */
export const useChatMessageCommonStyles = makeStyles({
  failed: {
    //TODO: can we reuse a theme color here?
    backgroundColor: 'rgba(168, 0, 0, 0.2)'
  },
  blocked: {
    maxWidth: '100%',
    minWidth: `${CHAT_MESSAGE_CONTAINER_MIN_WIDTH_REM}rem`,
    marginRight: '0rem',
    color: tokens.colorNeutralForeground2,

    // This makes message bubble show border in high contrast mode making each message distinguishable
    ...shorthands.border('1px', 'solid', 'transparent'),
    '& i': {
      paddingTop: '0.25rem'
    },

    '& p': {
      // Deal with awkward padding seen in messages from Teams.
      // For more info see https://github.com/Azure/communication-ui-library/pull/1507
      ...shorthands.marginBlock('0.125rem'),
      paddingRight: '0.75rem',
      fontStyle: 'italic'
    },

    '& a': {
      ...shorthands.marginBlock('0.125rem'),
      fontStyle: 'normal',
      color: tokens.colorBrandForegroundLink,
      ...shorthands.textDecoration('none')
    }
  }
});

/**
 * @private
 */
export const gutterWithAvatar: ComponentSlotStyle = {
  paddingTop: '1.65rem',
  width: `${AVATAR_WIDTH_REM}rem`,
  position: 'relative',
  float: 'left',
  display: 'block',
  visibility: 'visible',
  zIndex: AVATAR_ZINDEX
};

/**
 * @private
 */
export const gutterWithHiddenAvatar: ComponentSlotStyle = {
  ...gutterWithAvatar,
  visibility: 'hidden',
  // we use this hidden avatar just as a width placeholder
  // the placeholder is needed for responsive bubble width
  height: 0
};

/**
 * @private
 */
export const newMessageButtonStyle = mergeStyles({
  float: 'right',
  width: 'fit-content'
});

/**
 * @private
 */
export const buttonWithIconStyles: IButtonStyles = {
  textContainer: {
    display: 'contents'
  }
};

/**
 * @private
 */
export const loadPreviousMessageButtonStyle = mergeStyles({
  border: 'none',
  minHeight: '1.5rem',
  '&:hover': { background: 'none' },
  '&:active': { background: 'none' }
});

/**
 * @private
 */
export const DownIconStyle = mergeStyles({
  marginRight: '0.5em'
});
