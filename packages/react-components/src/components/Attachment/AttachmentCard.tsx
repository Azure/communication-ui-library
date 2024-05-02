// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  // eslint-disable-next-line no-restricted-imports
  Icon
} from '@fluentui/react';
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
  ProgressBar
} from '@fluentui/react-components';
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';
import React from 'react';
import { _pxToRem } from '@internal/acs-ui-common';
import { Announcer } from '../Announcer';
import { useEffect, useState, useMemo } from 'react';
import { _AttachmentUploadCardsStrings } from './AttachmentUploadCards';
import { useLocaleAttachmentCardStringsTrampoline } from '../utils/common';
import { AttachmentMetadata, AttachmentMenuAction, AttachmentMetadataWithProgress } from '../../types/Attachment';
import { useAttachmentCardStyles, attachmentNameContainerClassName } from '../styles/AttachmentCard.styles';

/**
 * @internal
 * AttachmentCard Component Props.
 */
export interface _AttachmentCardProps {
  /**
   * Attachment details including name, extension, url, etc.
   */
  attachment: AttachmentMetadata | AttachmentMetadataWithProgress;
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
}

/**
 * @internal
 * A component for displaying an attachment card with attachment icon and progress bar.
 *
 * `_AttachmentCard` internally uses the `Card` component from `@fluentui/react-components`. You can checkout the details about these components [here](https://react.fluentui.dev/?path=/docs/components-card).
 */
export const _AttachmentCard = (props: _AttachmentCardProps): JSX.Element => {
  const { attachment, menuActions, onActionHandlerFailed } = props;
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

  return (
    <div data-is-focusable={true}>
      <Announcer announcementString={announcerString} ariaLive={'polite'} />
      <Card
        className={attachmentCardStyles.root}
        size="small"
        role="listitem"
        appearance="filled-alternative"
        aria-label={attachment.name}
      >
        <CardHeader
          image={
            <Icon
              data-ui-id={'attachmenttype-icon'}
              iconName={
                getFileTypeIconProps({
                  extension: useMemo((): string => {
                    return attachment.extension ?? attachment.name.split('.').pop() ?? '';
                  }, [attachment]),
                  size: 24,
                  imageFileType: 'svg'
                }).iconName
              }
            />
          }
          header={
            <div className={attachmentNameContainerClassName}>
              <Text title={attachment.name}>{attachment.name}</Text>
            </div>
          }
          action={MappedMenuItems(menuActions, attachment, onActionHandlerFailed)}
        />
      </Card>
      {isUploadInProgress ? (
        <CardFooter>
          <ProgressBar thickness="medium" value={progress ? Math.max(progress, 0.05) : undefined} shape="rounded" />
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

  if (menuActions.length === 0) {
    return <></>;
  }
  return menuActions.length === 1 ? (
    <ToolbarButton
      aria-label={menuActions[0].name}
      icon={menuActions[0].icon}
      onClick={() => {
        try {
          menuActions[0].onClick(attachment);
        } catch (e) {
          handleOnClickError?.((e as Error).message);
        }
      }}
    />
  ) : (
    <Toolbar>
      <Menu>
        <MenuTrigger>
          <ToolbarButton icon={<Icon iconName="AttachmentMoreMenu" aria-label={localeStrings.attachmentMoreMenu} />} />
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {menuActions.map((menuItem, index) => (
              <MenuItem
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
