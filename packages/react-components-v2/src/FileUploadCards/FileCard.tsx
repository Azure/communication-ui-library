// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { ProgressBar, Text } from '@fluentui/react-components';
import { Document24Regular } from '@fluentui/react-icons';
import { ForwardRefComponent, getSlots, resolveShorthand } from '@fluentui/react-utilities';

import { useLocale } from '../localization';
import { _Announcer } from '../Announcer';
import { use_fileCardContainerStyles } from './FileCard.styles';
import { _FileCardProps, _FileCardSlots, _FileCardState } from './FileCard.types';
import { SendBoxStrings } from '../SendBox';

/**
 * A component for displaying a file card with file icon and progress bar.
 *
 * @internal
 */
export const _FileCard: ForwardRefComponent<_FileCardProps> = React.forwardRef((props, ref) => {
  const [state, setState] = useState<_FileCardState | undefined>(undefined);
  const localeStrings = useLocale().strings.sendBox;

  useEffect(() => {
    setState(use_FileCard(props, ref, localeStrings));
  }, [localeStrings, props, ref]);

  return render_FileCard(state);
});

const use_FileCard = (
  props: _FileCardProps,
  ref: React.Ref<HTMLDivElement>,
  localeStrings: SendBoxStrings
): _FileCardState => {
  const { actionIcon, fileName, progress, strings } = props;
  const showProgressIndicator = progress !== undefined && progress > 0 && progress < 1;
  const uploadStartedString = strings?.uploading ?? localeStrings.uploading;
  const uploadCompletedString = strings?.uploadCompleted ?? localeStrings.uploadCompleted;

  let announcerString: string | undefined = undefined;
  if (showProgressIndicator) {
    announcerString = `${uploadStartedString} ${fileName}`;
  } else if (progress === 1) {
    announcerString = `${fileName} ${uploadCompletedString}`;
  }
  const state: _FileCardState = {
    ...props,
    actionIcon: resolveShorthand(actionIcon),
    announcerString,
    components: {
      root: 'div',
      actionIcon: 'button'
    },
    root: {
      ref
    },
    showProgressIndicator
  };
  return state;
};

const render_FileCard = (state?: _FileCardState): React.JSX.Element => {
  const styles = use_fileCardContainerStyles();
  if (!state) {
    return <></>;
  }
  const { slots, slotProps } = getSlots<_FileCardSlots>(state);
  const { announcerString, actionHandler, fileName, progress, showProgressIndicator } = state;

  return (
    <div data-is-focusable={true}>
      <_Announcer announcementString={announcerString} ariaLive={'polite'} />
      <div
        className={styles.container}
        onClick={(e) => {
          actionHandler?.(e, fileName);
        }}
      >
        <div className={styles.fileInfo}>
          <Document24Regular />
          {/* <Icon
              data-ui-id={'filetype-icon'}
              iconName={
                getFileTypeIconProps({
                  extension: fileExtension,
                  size: 24,
                  imageFileType: 'svg'
                }).iconName
              }
            /> */}
          <div className={styles.fileNameTextContainer}>
            <Text className={styles.fileNameText}>{fileName}</Text>
          </div>
          <div className={styles.actionItem}>{slots.actionIcon && <slots.actionIcon {...slotProps.actionIcon} />}</div>
        </div>
      </div>
      {showProgressIndicator && <ProgressBar value={progress} />}
    </div>
  );
};

_FileCard.displayName = 'FileCard';
