import { FluentThemeProvider, VideoTile } from '@azure/communication-react';
import { IContextualMenuProps } from '@fluentui/react';
import React from 'react';

export const VideoTileMenuItemsExample: () => JSX.Element = () => {
  const videoTileStyles = { root: { height: '300px', width: '400px', border: '1px solid #999' } };

  const displayName = 'Marcus Aurelius';

  const contextualMenu: IContextualMenuProps = {
    items: [
      {
        key: 'mute',
        text: 'Mute',
        iconProps: {
          iconName: 'MicOff2',
          styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
        },
        onClick: () => alert(`Muted ${displayName}`)
      },
      {
        key: 'pin',
        text: 'Pin',
        iconProps: {
          iconName: 'Pin',
          styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
        },
        onClick: () => alert(`Pinned ${displayName}`)
      },
      {
        key: 'addto',
        text: 'Add to ...',
        subMenuProps: {
          items: [
            {
              key: 'favorites',
              name: 'Favorites',
              iconProps: {
                iconName: 'FavoriteStar',
                styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
              },
              onClick: () => alert(`Added ${displayName} to Favorites`)
            },
            {
              key: 'important',
              name: 'Important',
              iconProps: {
                iconName: 'Important',
                styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
              },
              onClick: () => alert(`Added ${displayName} to Important`)
            }
          ]
        }
      }
    ],
    styles: {}
  };

  return (
    <FluentThemeProvider>
      <VideoTile
        styles={videoTileStyles}
        displayName={displayName}
        showMuteIndicator={true}
        isMuted={true}
        renderElement={null}
        isMirrored={true}
        contextualMenu={contextualMenu}
      />
    </FluentThemeProvider>
  );
};
