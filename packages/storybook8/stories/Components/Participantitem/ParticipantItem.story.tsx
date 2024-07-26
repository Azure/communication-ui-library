// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ParticipantItem as ParticipantItemComponent } from '@azure/communication-react';
import { mergeStyles, Stack } from '@fluentui/react';
import { MicOff16Regular, ShareScreenStart20Filled, HandLeft16Regular } from '@fluentui/react-icons';
import React from 'react';

const onlyUnique = (value: string, index: number, self: string[]): boolean => {
  return self.indexOf(value) === index;
};

const ParticipantItemStory = (args: {
  menuItemsStr: string;
  displayName: string;
  me: boolean;
  isRaisedHand: boolean;
  isScreenSharing: boolean;
  isMuted: boolean;
}): JSX.Element => {
  const menuItems = args.menuItemsStr
    .split(',')
    .map((menuItem: string) => menuItem.trim())
    .filter(onlyUnique)
    .map((menuItem: string) => {
      return {
        key: menuItem,
        text: menuItem
      };
    });

  const containerStyle = { width: '15rem' };
  const iconStyles = mergeStyles({ display: 'flex', alignItems: 'center' });
  const tokenProps = { childrenGap: '0.5rem' };

  return (
    <div style={containerStyle}>
      <ParticipantItemComponent
        displayName={args.displayName}
        me={args.me}
        menuItems={menuItems}
        onRenderIcon={() => (
          <Stack horizontal tokens={tokenProps}>
            {args.isRaisedHand && <HandLeft16Regular className={iconStyles} primaryFill="currentColor" />}
            {args.isScreenSharing && <ShareScreenStart20Filled className={iconStyles} primaryFill="currentColor" />}
            {args.isMuted && <MicOff16Regular className={iconStyles} primaryFill="currentColor" />}
          </Stack>
        )}
      />
    </div>
  );
};

export const ParticipantItem = ParticipantItemStory.bind({});
