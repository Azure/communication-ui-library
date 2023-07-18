// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/// Adapted from: https://github.com/AlmeroSteyn/react-aria-live/blob/master/src/modules/Announcer.js

import React, { useEffect } from 'react';
import MessageBlock from './MessageBlock';

/** @private */
export type AnnouncerMessageBag = {
  message: string;
  id: string;
};

/** @private */
export type AnnouncerProps = {
  polite?: AnnouncerMessageBag;
  assertive?: AnnouncerMessageBag;
};

/** @private */
export const EMPTY_MESSAGE = { message: '', id: '' };

/** @private */
const Announcer = (props: AnnouncerProps): JSX.Element => {
  const newAssertive = props.assertive ?? EMPTY_MESSAGE;
  const oldAssertive = React.useRef<AnnouncerMessageBag>(EMPTY_MESSAGE);
  const [activeAssertive1, setActiveAssertive1] = React.useState<AnnouncerMessageBag>(EMPTY_MESSAGE);
  const [activeAssertive2, setActiveAssertive2] = React.useState<AnnouncerMessageBag>(EMPTY_MESSAGE);
  const alternateAssertive = React.useRef(false);

  useEffect(() => {
    if (oldAssertive.current.message !== newAssertive?.message || oldAssertive.current.id !== newAssertive?.id) {
      setActiveAssertive1(alternateAssertive.current ? EMPTY_MESSAGE : newAssertive);
      setActiveAssertive2(alternateAssertive.current ? newAssertive : EMPTY_MESSAGE);
      oldAssertive.current = newAssertive;
      alternateAssertive.current = !alternateAssertive.current;
    }
  }, [newAssertive]);

  const newPolite = props.polite ?? EMPTY_MESSAGE;
  const oldPolite = React.useRef<AnnouncerMessageBag>(EMPTY_MESSAGE);
  const [activePolite1, setActivePolite1] = React.useState<AnnouncerMessageBag>(EMPTY_MESSAGE);
  const [activePolite2, setActivePolite2] = React.useState<AnnouncerMessageBag>(EMPTY_MESSAGE);
  const alternatePolite = React.useRef(false);

  useEffect(() => {
    if (oldPolite.current.message !== newPolite?.message || oldPolite.current.id !== newPolite?.id) {
      setActivePolite1(alternatePolite.current ? EMPTY_MESSAGE : newPolite);
      setActivePolite2(alternatePolite.current ? newPolite : EMPTY_MESSAGE);
      oldPolite.current = newPolite;
      alternatePolite.current = !alternatePolite.current;
    }
  }, [newPolite]);

  return (
    <div>
      <MessageBlock ariaLive="assertive" message={activeAssertive1.message} />
      <MessageBlock ariaLive="assertive" message={activeAssertive2.message} />
      <MessageBlock ariaLive="polite" message={activePolite1.message} />
      <MessageBlock ariaLive="polite" message={activePolite2.message} />
    </div>
  );
};

export default Announcer;
