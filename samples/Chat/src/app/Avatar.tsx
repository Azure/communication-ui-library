// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { getBackgroundColor } from './utils/utils';
import { fetchEmojiForUser } from './utils/emojiCache';
import { messageAvatarContainerStyle } from './styles/MessageAvatar.styles';

type AvatarProps = {
  userId: string;
};

const Avatar = (props: AvatarProps): JSX.Element => {
  const [emoji, setEmoji] = useState('');
  const userId = props.userId;

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  });

  useEffect(() => {
    fetchEmojiForUser(userId).then((emoji) => {
      // Check if the component is still mounted after the fetch has completed.
      if (mounted.current) {
        setEmoji(emoji);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className={messageAvatarContainerStyle(getBackgroundColor(emoji)?.backgroundColor)}>{emoji}</div>;
};

export const onRenderAvatar = (userId?: string): JSX.Element => {
  return <Avatar userId={userId ?? ''} />;
};
