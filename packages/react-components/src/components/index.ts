// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { TypingIndicator } from './TypingIndicator';
export type { TypingIndicatorProps, TypingIndicatorStrings, TypingIndicatorStylesProps } from './TypingIndicator';

export { ErrorBar } from './ErrorBar';
export type { ActiveErrorMessage, ErrorBarProps, ErrorBarStrings, ErrorType } from './ErrorBar';

export { GridLayout } from './GridLayout';
export type { GridLayoutProps, GridLayoutStyles } from './GridLayout';

export { SendBox } from './SendBox';
export type { SendBoxProps, SendBoxStrings, SendBoxStylesProps } from './SendBox';
/* @conditional-compile-remove(file-sharing) */
export type { ActiveFileUpload } from './SendBox';

export { MessageStatusIndicator } from './MessageStatusIndicator';
export type { MessageStatusIndicatorProps, MessageStatusIndicatorStrings } from './MessageStatusIndicator';

export { MessageThread } from './MessageThread';
export type {
  MessageProps,
  MessageThreadProps,
  MessageThreadStrings,
  MessageThreadStyles,
  JumpToNewMessageButtonProps,
  MessageRenderer,
  UpdateMessageCallback
} from './MessageThread';

export { StreamMedia } from './StreamMedia';
export type { StreamMediaProps } from './StreamMedia';

export { ParticipantItem } from './ParticipantItem';
export type { ParticipantItemProps, ParticipantItemStrings, ParticipantItemStyles } from './ParticipantItem';

export { ParticipantList } from './ParticipantList';
export type {
  ParticipantListItemStyles,
  ParticipantListProps,
  ParticipantListStyles,
  ParticipantMenuItemsCallback
} from './ParticipantList';

export { VideoGallery } from './VideoGallery';
export type { VideoGalleryProps, VideoGalleryStrings, VideoGalleryStyles, VideoGalleryLayout } from './VideoGallery';
export type { HorizontalGalleryStyles } from './HorizontalGallery';

export { LocalVideoCameraCycleButton } from './LocalVideoCameraButton';
export type { LocalVideoCameraCycleButtonProps } from './LocalVideoCameraButton';

export { CameraButton } from './CameraButton';
export type {
  CameraButtonContextualMenuStyles,
  CameraButtonProps,
  CameraButtonStrings,
  CameraButtonStyles
} from './CameraButton';

export { ControlBar } from './ControlBar';
export type { ControlBarProps, ControlBarLayout } from './ControlBar';

export { ControlBarButton } from './ControlBarButton';
export type { ControlBarButtonProps, ControlBarButtonStrings, ControlBarButtonStyles } from './ControlBarButton';

export { EndCallButton } from './EndCallButton';
export type { EndCallButtonProps, EndCallButtonStrings } from './EndCallButton';

export { MicrophoneButton } from './MicrophoneButton';
export type {
  MicrophoneButtonStyles,
  MicrophoneButtonContextualMenuStyles,
  MicrophoneButtonProps,
  MicrophoneButtonStrings
} from './MicrophoneButton';

export { DevicesButton } from './DevicesButton';
export type {
  OptionsDevice,
  DevicesButtonProps,
  DevicesButtonStrings,
  DevicesButtonStyles,
  DevicesButtonContextualMenuStyles
} from './DevicesButton';

export { ParticipantsButton } from './ParticipantsButton';
export type {
  ParticipantsButtonContextualMenuStyles,
  ParticipantsButtonProps,
  ParticipantsButtonStrings,
  ParticipantsButtonStyles
} from './ParticipantsButton';

export { ScreenShareButton } from './ScreenShareButton';
export type { ScreenShareButtonProps, ScreenShareButtonStrings } from './ScreenShareButton';

export { VideoTile } from './VideoTile';
export type { VideoTileProps, VideoTileStylesProps } from './VideoTile';

export { _PictureInPictureInPicture } from './PictureInPictureInPicture/PictureInPictureInPicture';
export type {
  _PictureInPictureInPictureProps,
  _PictureInPictureInPictureStrings
} from './PictureInPictureInPicture/PictureInPictureInPicture';
export type {
  _PictureInPictureInPictureTileProps,
  _TileOrientation
} from './PictureInPictureInPicture/PictureInPictureInPictureTile';

export * from './Drawer';
/* @conditional-compile-remove(file-sharing) */
export type { SendBoxErrorBarError } from './SendBoxErrorBar';
export * from './FileCard';
export * from './FileCardGroup';
export * from './ModalClone/ModalClone';
export * from './FileDownloadCards';

export { _useContainerHeight, _useContainerWidth } from './utils/responsive';

export { _ComplianceBanner } from './ComplianceBanner';
export type { _ComplianceBannerProps, _ComplianceBannerStrings } from './ComplianceBanner';

export { _Dialpad } from './Dialpad/Dialpad';
export type { _DialpadProps, _DialpadStrings, _DialpadButtonProps, _DialpadStyles } from './Dialpad/Dialpad';

/* @conditional-compile-remove(PSTN-calls) */
export { HoldButton } from './HoldButton';
/* @conditional-compile-remove(PSTN-calls) */
export type { HoldButtonProps, HoldButtonStrings } from './HoldButton';

export { _LocalVideoTile } from './LocalVideoTile';
export { _RemoteVideoTile } from './RemoteVideoTile';
