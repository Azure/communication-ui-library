// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// import { Button } from '@fluentui/react-components';
import { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';
import { _FileUploadCardsStrings } from './FileUploadCards.strings';

/**
 * Available slots in the {@link _FileCard}.
 *
 * @internal
 */
export type _FileCardSlots = {
  root: NonNullable<Slot<'div'>>;

  /**
   * Icon to display for actions like download, upload, etc. along the file name.
   */
  actionIcon: Slot<'div'>;
};

/**
 * _FileCard Component Props.
 *
 * @internal
 */
export type _FileCardProps = Omit<
  ComponentProps<Partial<_FileCardSlots>, 'root'>,
  'className' | 'style' | 'ref' | 'id' | 'tabIndex'
> & {
  /**
   * Event sent when actionIcon is clicked
   */
  actionHandler?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, fileName: string) => void;
  /**
   * Extension of the file used for rendering the file icon.
   */
  fileExtension: string;
  /**
   * File name.
   */
  fileName: string;
  /**
   * File upload progress percentage between 0 and 1.
   * File transfer progress indicator is only shown when the value is greater than 0 and less than 1.
   */
  progress?: number;

  /**
   * Optional aria-label strings for file cards
   */
  strings?: _FileUploadCardsStrings;
};

/**
 * State used in rendering _FileCard
 * @internal
 */
export type _FileCardState = ComponentState<_FileCardSlots> &
  Pick<_FileCardProps, 'actionHandler' | 'fileName' | 'progress'> & {
    announcerString?: string;
    showProgressIndicator: boolean;
  };
