// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  concatStyleSets,
  ContextualMenu,
  DirectionalHint,
  IContextualMenuItem,
  IPersona,
  Persona,
  PersonaSize,
  Target,
  useTheme
} from '@fluentui/react';
import { _formatString } from '@internal/acs-ui-common';
import React, { useMemo } from 'react';
import { OnRenderAvatarCallback } from '../../types';
import { MessageThreadStrings } from '../MessageThread';
import {
  chatMessageMenuStyle,
  menuIconStyleSet,
  menuItemIncreasedSizeStyles
} from '../styles/ChatMessageComponent.styles';

/** @private */
export interface ChatMessageActionFlyoutProps {
  target?: Target;
  hidden: boolean;
  strings: MessageThreadStrings;
  onEditClick?: () => void;
  onRemoveClick?: () => void;
  onDismiss: () => void;
  messageReadBy?: { id: string; name: string }[];
  remoteParticipantsCount?: number;
  /**
   * Increase the height of the flyout items.
   * Recommended when interacting with the chat message using touch.
   */
  increaseFlyoutItemSize: boolean;
  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;
}

/**
 * Chat message actions flyout that contains actions such as Edit Message, or Remove Message.
 *
 * @private
 */
export const ChatMessageActionFlyout = (props: ChatMessageActionFlyoutProps): JSX.Element => {
  const theme = useTheme();
  const messageReadByCount = props.messageReadBy?.length;
  const messageReadByList: IContextualMenuItem[] | undefined = props.messageReadBy?.map((person) => {
    const personaOptions: IPersona = {
      hidePersonaDetails: true,
      size: PersonaSize.size24,
      text: person.name,
      styles: {
        root: {
          margin: '0.25rem'
        }
      }
    };
    const { onRenderAvatar } = props;
    return {
      key: person.name,
      text: person.name,
      itemProps: { styles: props.increaseFlyoutItemSize ? menuItemIncreasedSizeStyles : undefined },
      onRenderIcon: () =>
        onRenderAvatar ? onRenderAvatar(person.id ?? '', personaOptions) : <Persona {...personaOptions} />,
      iconProps: {
        styles: menuIconStyleSet
      }
    };
  });

  const menuItems = useMemo((): IContextualMenuItem[] => {
    const items: IContextualMenuItem[] = [
      {
        key: 'Edit',
        text: props.strings.editMessage,
        itemProps: { styles: props.increaseFlyoutItemSize ? menuItemIncreasedSizeStyles : undefined },
        iconProps: { iconName: 'MessageEdit', styles: menuIconStyleSet },
        onClick: props.onEditClick
      },
      {
        key: 'Remove',
        text: props.strings.removeMessage,
        itemProps: { styles: props.increaseFlyoutItemSize ? menuItemIncreasedSizeStyles : undefined },
        iconProps: {
          iconName: 'MessageRemove',
          styles: menuIconStyleSet
        },
        onClick: props.onRemoveClick
      }
    ];
    // only show read by x of x if more than 3 participants in total including myself
    // TODO: change strings.messageReadCount to be required if we can fallback to our own en-us strings for anything that Contoso doesn't provide
    if (
      props.remoteParticipantsCount &&
      messageReadByCount !== undefined &&
      props.remoteParticipantsCount >= 2 &&
      props.strings.messageReadCount
    ) {
      items.push({
        key: 'Read Count',
        text: _formatString(props.strings.messageReadCount, {
          messageReadByCount: `${messageReadByCount}`,
          remoteParticipantsCount: `${props.remoteParticipantsCount}`
        }),
        itemProps: {
          styles: concatStyleSets(
            {
              linkContent: {
                color: messageReadByCount > 0 ? theme.palette.neutralPrimary : theme.palette.neutralTertiary
              },
              root: {
                borderTop: `1px solid ${theme.palette.neutralLighter}`
              }
            },
            props.increaseFlyoutItemSize ? menuItemIncreasedSizeStyles : undefined
          )
        },
        subMenuProps: {
          items: messageReadByList ?? []
        },
        iconProps: {
          iconName: 'MessageSeen',
          styles: {
            root: {
              color: messageReadByCount > 0 ? theme.palette.themeDarkAlt : theme.palette.neutralTertiary
            }
          }
        },
        submenuIconProps: {
          iconName: 'HorizontalGalleryRightButton',
          styles: menuIconStyleSet
        },
        disabled: messageReadByCount <= 0
      });
    }

    return items;
  }, [
    props.increaseFlyoutItemSize,
    props.onEditClick,
    props.onRemoveClick,
    props.strings.editMessage,
    props.strings.removeMessage,
    props.remoteParticipantsCount,
    messageReadByList,
    messageReadByCount
  ]);

  // gap space uses pixels
  return (
    <ContextualMenu
      alignTargetEdge={true}
      gapSpace={5 /*px*/}
      isBeakVisible={false}
      items={menuItems}
      hidden={props.hidden}
      target={props.target}
      onDismiss={props.onDismiss}
      directionalHint={DirectionalHint.topRightEdge}
      className={chatMessageMenuStyle}
    />
  );
};
