// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React from 'react';
import { Mention } from '../MentionPopover';

/**
 * Provides the default implementation for rendering an Mention in a message thread
 * @param mention - The mention to render
 *
 * @private
 */
export const defaultOnMentionRender = (mention: Mention): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MsftMention = 'msft-mention' as any;
  return (
    <MsftMention id={mention.id} key={Math.random().toString()}>
      {mention.displayText}
    </MsftMention>
  );
};
