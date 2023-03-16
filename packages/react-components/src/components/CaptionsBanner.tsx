// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IPersona, Persona, Stack, PersonaSize, Text, mergeStyles } from '@fluentui/react';
import React, { useEffect, useRef } from 'react';
import { _pxToRem } from '@internal/acs-ui-common';
import { _FileUploadCardsStrings } from './FileUploadCards';
import { OnRenderAvatarCallback } from '../types';
import { Ref } from '@fluentui/react-northstar';

/**
 * @internal
 * information required for each line of caption
 */
export type CaptionInfo = {
  displayName: string;
  caption: string;
  userId?: string;
};

/**
 * @internal
 * _CaptionsBanner Component Props.
 */
export interface _CaptionsBannerProps {
  captions: CaptionInfo[];
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

  const gridContainerClassName = mergeStyles({
    overflowY: 'scroll',
    overflowX: 'hidden',
    width: '100%',
    height: _pxToRem(60),
    display: 'grid',
    gridTemplateColumns: '20% 80%',
    alignItems: 'stretch',
    columnGap: _pxToRem(16),
    padding: _pxToRem(8)
  });

  const displayNameClassName = mergeStyles({
    fontWeight: 600,
    fontSize: _pxToRem(12),
    lineHeight: _pxToRem(30)
  });

  const captionClassName = mergeStyles({
    fontWeight: 400,
    fontSize: _pxToRem(16),
    lineHeight: _pxToRem(30)
  });

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
        {captions.map((caption) => {
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

          return (
            <>
              <div>
                <Stack horizontal verticalAlign="center" horizontalAlign="end">
                  <span>{userIcon}</span>
                  <Text className={displayNameClassName}>{caption.displayName}</Text>
                </Stack>
              </div>
              <div>
                <span>
                  <Text className={captionClassName}>{caption.caption}</Text>
                </span>
              </div>
            </>
          );
        })}
      </div>
    </Ref>
  );
};
