// Importing necessary libraries
import { FluentThemeProvider, VideoTile } from '@azure/communication-react';
import { IContextualMenuProps } from '@fluentui/react';
import React, { useState } from 'react';
import { Reaction } from '../../../../react-components/src/types';

// Defining the App component
export const ReactionAnimationVideoTile: () => JSX.Element = () => {
    const [showReaction, setShowReaction] = useState(false);
    const [reactionKind, setReactionKind] = useState('');
    const videoTileStyles = { root: { height: '300px', width: '400px', border: '1px solid #999' } };

    const displayName = 'Marcus Aurelius';

    var timeOutId;

    const handleReactionClick = (reaction: string) => {
        if(timeOutId != undefined) {
          setShowReaction(false);
          clearTimeout(timeOutId);
        }

        setShowReaction(true);
        setReactionKind(reaction);

        timeOutId = setTimeout(function() {
          setShowReaction(false);
          setReactionKind('');
        }, 2170); // Reaction fades out after 2.17 seconds
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

      const react: Reaction = {
        shouldRender: showReaction,
        reactionType: reactionKind,
      }
    
      return (
        <div>
            <button onClick={() => handleReactionClick('like')}>Like React!</button>
            <button onClick={() => handleReactionClick('applause')}>Applause React!</button>
            <button onClick={() => handleReactionClick('heart')}>Heart React!</button>
            <button onClick={() => handleReactionClick('laugh')}>Laugh React!</button>
            <button onClick={() => handleReactionClick('surprised')}>Surprised React!</button>

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
                    reaction={react}
                />
            </FluentThemeProvider>
            }
        </div>
        
      );
    };

