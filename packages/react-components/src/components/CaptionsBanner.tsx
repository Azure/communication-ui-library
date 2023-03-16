// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IPersona, Persona, Stack, PersonaSize, Text } from '@fluentui/react';
import React, { useEffect, useRef } from 'react';
import { _FileUploadCardsStrings } from './FileUploadCards';
import { OnRenderAvatarCallback } from '../types';
import { Ref } from '@fluentui/react-northstar';
import { captionClassName, displayNameClassName, gridContainerClassName } from './styles/CaptionsBanner.style';

/**
 * @internal
 * information required for each line of caption
 */
export type _CaptionsInfo = {
  displayName: string;
  captionText: string;
  userId?: string;
};

/**
 * @internal
 * _CaptionsBanner Component Props.
 */
export interface _CaptionsBannerProps {
  captions: _CaptionsInfo[];
  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;
}

/**
 * @internal
 * A component for displaying a CaptionsBanner with user icon, displayName and captions text.
 */
export const _CaptionsBanner = (props: _CaptionsBannerProps): JSX.Element => {
  const { captions, onRenderAvatar } = props;
  const captionsScrollDivRef = useRef<HTMLElement>(null);
  const scrollToBottom = (): void => {
    if (captionsScrollDivRef.current) {
      captionsScrollDivRef.current.scrollTop = captionsScrollDivRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [captions]);

  return (
    <Ref innerRef={captionsScrollDivRef}>
      <div data-is-focusable={true} className={gridContainerClassName}>
        {captions.map((caption, key) => {
          const personaOptions: IPersona = {
            hidePersonaDetails: true,
            size: PersonaSize.size24,
            text: caption.displayName,
            showOverflowTooltip: false,
            styles: {
              root: {
                margin: '0.25rem'
              }
            }
          };

          const userIcon = onRenderAvatar ? (
            onRenderAvatar(caption.userId ?? '', personaOptions)
          ) : (
            <Persona {...personaOptions} />
          );
          // if display name is too long, replace with ...
          if (caption.displayName.length > 15) {
            caption.displayName = `${caption.displayName.substring(0, 16)}...`;
          }

          return (
            <>
              <div key={`username_${key}`}>
                <Stack horizontal verticalAlign="center" horizontalAlign="end">
                  <span>{userIcon}</span>
                  <Text className={displayNameClassName}>{caption.displayName}</Text>
                </Stack>
              </div>
              <div key={`captionText_${key}`}>
                <span>
                  <Text className={captionClassName}>{caption.captionText}</Text>
                </span>
              </div>
            </>
          );
        })}
      </div>
    </Ref>
  );
};
