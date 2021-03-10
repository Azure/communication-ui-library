// © Microsoft Corporation. All rights reserved.

import SendBox from './SendBox';
import TypingIndicator, { TypingIndicatorComponent } from './TypingIndicator';
import { GridLayoutComponent } from './GridLayout';
import ErrorBar, { ErrorBarComponent } from './ErrorBar';
import { WithErrorHandling } from '../utils/WithErrorHandling';

export {
  SendBox,
  TypingIndicator,
  TypingIndicatorComponent,
  GridLayoutComponent,
  ErrorBar,
  ErrorBarComponent,
  WithErrorHandling
};

export { SendBoxComponent } from './SendBox';
export { ReadReceiptComponent } from './ReadReceipt';
export type { ReadReceiptProps } from './ReadReceipt';
export { MediaGalleryTileComponent } from './MediaGalleryTile';
export { StreamMediaComponent } from './StreamMedia';
export { ParticipantItem } from './ParticipantItem';
export {
  CONTROL_BAR_LAYOUTS,
  ControlBar,
  ControlButton,
  CallControlBar,
  videoButtonProps,
  audioButtonProps,
  screenShareButtonProps,
  optionsButtonProps,
  answerButtonProps,
  hangupButtonProps
} from './ControlBar';

export { VideoTile } from './VideoTile';
export type { VideoTileProps, VideoTileStylesProps } from './VideoTile';
