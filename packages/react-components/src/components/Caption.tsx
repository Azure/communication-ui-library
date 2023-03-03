// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IPersona, Persona, Stack, PersonaSize, Text, IStackTokens, mergeStyles } from '@fluentui/react';
import React from 'react';
import { _pxToRem } from '@internal/acs-ui-common';
import { _FileUploadCardsStrings } from './FileUploadCards';
import { OnRenderAvatarCallback } from '../types';

/**
 * @internal
 * _Caption Component Props.
 */
export interface _CaptionProps {
  displayName: string;
  caption: string;
  userId?: string;
  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;
}

/**
 * @internal
 * A component for displaying a caption with user icon, displayName and caption text.
 */
export const _Caption = (props: _CaptionProps): JSX.Element => {
  const { userId, displayName, caption, onRenderAvatar } = props;

  const personaOptions: IPersona = {
    hidePersonaDetails: true,
    size: PersonaSize.size24,
    text: displayName,
    showOverflowTooltip: false,
    styles: {
      root: {
        margin: '0.25rem'
      }
    }
  };

  const userIcon = onRenderAvatar ? onRenderAvatar(userId ?? '', personaOptions) : <Persona {...personaOptions} />;
  const spacingStackTokens: IStackTokens = {
    childrenGap: 10,
    padding: 10
  };

  const displayNameClassName = mergeStyles({
    fontWeight: 600,
    fontSize: _pxToRem(12),
    lineHeight: _pxToRem(16)
  });

  const captionClassName = mergeStyles({
    fontWeight: 400,
    fontSize: _pxToRem(16),
    lineHeight: _pxToRem(20)
  });

  return (
    <div data-is-focusable={true}>
      <Stack horizontal verticalAlign="center" tokens={spacingStackTokens}>
        <Stack horizontal verticalAlign="center">
          <span>{userIcon}</span>
          <Text className={displayNameClassName}>{displayName}</Text>
        </Stack>

        <span>
          <Text className={captionClassName}>{caption}</Text>
        </span>
      </Stack>
    </div>
  );
};
