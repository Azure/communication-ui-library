// Importing necessary libraries
import { FluentThemeProvider, VideoTile } from '@azure/communication-react';
import { IContextualMenuProps } from '@fluentui/react';
import React, { useState } from 'react';

// Defining the App component
export const ReactionAnimationVideoTile: () => JSX.Element = () => {
    const [showReaction, setShowReaction] = useState(false);
    const videoTileStyles = { root: { height: '300px', width: '400px', border: '1px solid #999' } };

    const displayName = 'Marcus Aurelius';

    const handleReactionClick = () => {
        setShowReaction(true);
        setTimeout(() => setShowReaction(false), 2000); // Reaction fades out after 1 second
      };
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
        <div>
            <button onClick={handleReactionClick}>React!</button>
            {
                <FluentThemeProvider>
                <VideoTile
                    styles={videoTileStyles}
                    displayName={displayName}
                    showMuteIndicator={true}
                    isMuted={true}
                    renderElement={null}
                    isMirrored={true}
                    contextualMenu={contextualMenu}
                    reaction={showReaction}
                />
            </FluentThemeProvider>
            }
        </div>
        
      );
    };

