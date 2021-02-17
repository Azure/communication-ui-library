// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { useEffect, useState } from 'react';
import { getBackgroundColor } from './utils';
import { fetchEmojiForUser } from './emojiCache';
import { messageAvatarContainerStyle } from '../styles/MessageAvatar.styles';

type AvatarProps = {
  userId: string;
};

const AvatarComponent = (props: AvatarProps): JSX.Element => {
  const [emoji, setEmoji] = useState('');
  const userId = props.userId;

  useEffect(() => {
    fetchEmojiForUser(userId).then(setEmoji);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className={messageAvatarContainerStyle(getBackgroundColor(emoji)?.backgroundColor)}>{emoji}</div>;
};

export const onRenderAvatar = (userId: string): JSX.Element => {
  return <AvatarComponent userId={userId} />;
};
