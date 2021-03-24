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
export { ChatThreadComponent, ChatThread } from './ChatThread';
export type { ChatThreadProps, ChatThreadStylesProps } from './ChatThread';
export { StreamMedia } from './StreamMedia';
export { ParticipantItem } from './ParticipantItem';
export type { ParticipantItemProps } from './ParticipantItem';
export {
  CONTROL_BAR_LAYOUTS,
  ControlBar,
  videoButtonProps,
  audioButtonProps,
  screenShareButtonProps,
  optionsButtonProps,
  answerButtonProps,
  hangupButtonProps
} from './ControlBar';

export { VideoTile } from './VideoTile';
export type { VideoTileProps, VideoTileStylesProps } from './VideoTile';
export { ThemeSelector } from './ThemeSelector';
export type { ThemeSelectorProps } from './ThemeSelector';
export { ThemeToggler } from './ThemeToggler';
export type { ThemeTogglerProps } from './ThemeToggler';
