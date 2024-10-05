// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon, TooltipHost } from '@fluentui/react';
import {
  Card,
  CardHeader,
  Text,
  Menu,
  MenuTrigger,
  ToolbarButton,
  MenuPopover,
  MenuItem,
  MenuList,
  Toolbar,
  CardFooter,
  ProgressBar,
  mergeClasses
} from '@fluentui/react-components';
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';
import React from 'react';
import { _pxToRem } from '@internal/acs-ui-common';
import { Announcer } from '../Announcer';
import { useEffect, useState, useMemo } from 'react';
import { _AttachmentUploadCardsStrings } from './AttachmentUploadCards';
import { useLocaleAttachmentCardStringsTrampoline } from '../utils/common';
import { AttachmentMenuAction } from '../../types/Attachment';
import { AttachmentMetadata, AttachmentMetadataInProgress } from '@internal/acs-ui-common';
import {
  useAttachmentCardStyles,
  ATTACHMENT_CARD_MIN_PROGRESS,
  titleTooltipContainerStyle
} from '../styles/AttachmentCard.styles';

/**
 * @internal
 * AttachmentCard Component Props.
 */
export interface _AttachmentCardProps {
  /**
   * Attachment details including name, extension, url, etc.
   */
  attachment: AttachmentMetadata | AttachmentMetadataInProgress;
  /**
   * An array of menu actions to be displayed in the attachment card.
   */
  menuActions: AttachmentMenuAction[];
  /**
   * Optional aria label strings for attachment upload cards
   */
  strings?: _AttachmentUploadCardsStrings;
  /**
   * Optional callback that runs if menu bar action onclick throws.
   */
  onActionHandlerFailed?: (errMsg: string) => void;
  /**
   * Optional flag to enable self resizing of the attachment card.
   */
  selfResizing?: boolean;
}

/**
 * @internal
 * A component for displaying an attachment card with attachment icon and progress bar.
 *
 * `_AttachmentCard` internally uses the `Card` component from `@fluentui/react-components`. You can checkout the details about these components [here](https://react.fluentui.dev/?path=/docs/components-card).
 */
export const _AttachmentCard = (props: _AttachmentCardProps): JSX.Element => {
  const { attachment, menuActions, onActionHandlerFailed, selfResizing } = props;
  const attachmentCardStyles = useAttachmentCardStyles();

  const progress = useMemo(() => {
    return 'progress' in attachment ? attachment.progress : undefined;
  }, [attachment]);

  const isUploadInProgress = useMemo(() => {
    return progress !== undefined && progress >= 0 && progress < 1;
  }, [progress]);

  const [announcerString, setAnnouncerString] = useState<string | undefined>(undefined);
  const localeStrings = useLocaleAttachmentCardStringsTrampoline();
  const uploadStartedString = props.strings?.uploading ?? localeStrings.uploading;
  const uploadCompletedString = props.strings?.uploadCompleted ?? localeStrings.uploadCompleted;

  useEffect(() => {
    if (isUploadInProgress) {
      setAnnouncerString(`${uploadStartedString} ${attachment.name}`);
    } else if (progress === 1) {
      setAnnouncerString(`${attachment.name} ${uploadCompletedString}`);
    } else {
      setAnnouncerString(undefined);
    }
  }, [progress, isUploadInProgress, attachment.name, uploadStartedString, uploadCompletedString]);

  const extension = useMemo((): string => {
    const re = /(?:\.([^.]+))?$/;
    const match = re.exec(attachment.name);
    return match && match[1] ? match[1] : '';
  }, [attachment]);
  return (
    <div data-is-focusable={true}>
      <Announcer announcementString={announcerString} ariaLive={'polite'} />
      <Card
        className={mergeClasses(
          attachmentCardStyles.root,
          selfResizing ? attachmentCardStyles.dynamicWidth : attachmentCardStyles.staticWidth
        )}
        size="small"
        role="listitem"
        appearance="filled-alternative"
        aria-label={attachment.name}
        data-testid={'attachment-card'}
      >
        <CardHeader
          className={attachmentCardStyles.content}
          image={{
            className: attachmentCardStyles.fileIcon,
            children: (
              <Icon
                data-ui-id={'attachmenttype-icon'}
                iconName={
                  getFileTypeIconProps({
                    extension: extension,
                    size: 24,
                    imageFileType: 'svg'
                  }).iconName
                }
              />
            )
          }}
          header={{
            id: 'attachment-' + attachment.id,
            children: (
              <TooltipHost
                content={attachment.name}
                calloutProps={{
                  gapSpace: 0,
                  target: '#attachment-' + attachment.id
                }}
                hostClassName={titleTooltipContainerStyle}
              >
                <Text className={attachmentCardStyles.title} aria-label={attachment.name}>
                  {attachment.name}
                </Text>
              </TooltipHost>
            )
          }}
          action={{
            className: attachmentCardStyles.actions,
            children: MappedMenuItems(
              menuActions,
              {
                ...attachment,
                url: attachment.url ?? ''
              },
              onActionHandlerFailed
            )
          }}
        />
      </Card>
      {isUploadInProgress ? (
        <CardFooter>
          <ProgressBar
            thickness="medium"
            value={Math.max(progress ?? 0, ATTACHMENT_CARD_MIN_PROGRESS)}
            shape="rounded"
          />
        </CardFooter>
      ) : (
        <> </>
      )}
    </div>
  );
};

const MappedMenuItems = (
  menuActions: AttachmentMenuAction[],
  attachment: AttachmentMetadata,
  handleOnClickError?: (errMsg: string) => void
): JSX.Element => {
  const localeStrings = useLocaleAttachmentCardStringsTrampoline();

  const firstMenuAction = menuActions.at(0);

  if (!firstMenuAction) {
    return <></>;
  }
  return menuActions.length === 1 ? (
    <TooltipHost content={firstMenuAction.name}>
      <ToolbarButton
        aria-label={firstMenuAction.name}
        role="button"
        icon={firstMenuAction.icon}
        onClick={() => {
          try {
            firstMenuAction.onClick(attachment);
          } catch (e) {
            handleOnClickError?.((e as Error).message);
          }
        }}
      />
    </TooltipHost>
  ) : (
    <Toolbar>
      <Menu>
        <TooltipHost content={localeStrings.attachmentMoreMenu}>
          <MenuTrigger>
            <ToolbarButton
              aria-label={localeStrings.attachmentMoreMenu}
              role="button"
              icon={<Icon iconName="AttachmentMoreMenu" />}
            />
          </MenuTrigger>
        </TooltipHost>
        <MenuPopover>
          <MenuList>
            {menuActions.map((menuItem, index) => (
              <MenuItem
                aria-label={menuItem.name}
                key={index}
                icon={menuItem.icon}
                onClick={async () => {
                  try {
                    await menuItem.onClick(attachment);
                  } catch (e) {
                    handleOnClickError?.((e as Error).message);
                  }
                }}
              >
                {menuItem.name}
              </MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    </Toolbar>
  );
};
