// © Microsoft Corporation. All rights reserved.

import { IStyle, mergeStyles, Persona, PersonaSize, Stack } from '@fluentui/react';
import React from 'react';

const videoTileStyles: IStyle = {
  position: 'relative',
  border: '2px solid #AAA'
};

const videoBackgroundStyle: IStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  minWidth: '100%',
  minHeight: '100%',
  zIndex: -1,
  objectPosition: 'center',
  objectFit: 'cover'
};

const videoChildrenContainerStyle: IStyle = {};

interface CustomStylesProps {
  root?: IStyle;
}

interface VideoTileStylesProps extends CustomStylesProps {
  videoContainer?: IStyle;
  overlayContainer?: IStyle;
}

interface VideoTileProps {
  /** React Child components. */
  children?: React.ReactNode;
  /** Custom styles */
  styles: VideoTileStylesProps;
  /** Determines if the static image or video stream should be rendered. */
  isVideoReady: boolean;
  /** Determines the actual video stream element to render. */
  videoProvider: () => HTMLElement | null;
  /** Determines if the video is mirrored or not */
  invertVideo?: boolean;
  /** Custom Component to render when no video is available. Defaults to a Persona Icon */
  placeholder: JSX.Element;
}

interface PlaceholderProps {
  /** Optional avatar name for the media gallery tile. */
  avatarName?: string;
  /** Optional property to set the aria label of the media gallery tile if there is no available stream. */
  noVideoAvailableAriaLabel?: string;
}

const DefaultPlaceholder = (props: PlaceholderProps): JSX.Element => {
  const { avatarName, noVideoAvailableAriaLabel } = props;
  return (
    <Stack style={{ position: 'absolute', left: '50%', bottom: '50%' }}>
      <Persona
        styles={{ root: { position: 'relative', left: '-50%', bottom: '-50%' } }}
        size={PersonaSize.size100}
        hidePersonaDetails={true}
        text={avatarName}
        aria-label={noVideoAvailableAriaLabel}
      />
    </Stack>
  );
};

export const VideoTile = (props: VideoTileProps & PlaceholderProps): JSX.Element => {
  const { styles, isVideoReady, videoProvider } = props;
  const placeholder = props.placeholder ?? <DefaultPlaceholder {...props} />;
  return (
    <Stack className={mergeStyles(videoTileStyles, styles.root)}>
      {isVideoReady ? (
        <Stack className={mergeStyles(videoBackgroundStyle, styles.videoContainer)}>{videoProvider()}</Stack>
      ) : (
        placeholder
      )}
      <Stack className={mergeStyles(videoChildrenContainerStyle, styles.overlayContainer)}>{props.children}</Stack>
    </Stack>
  );
};
