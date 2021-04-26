import { MessageBar } from '@fluentui/react';
import React, { useRef } from 'react';
import { bannerMessage, TeamsInterop } from './TeamsInterop.snippet';

export const Banner = (props: TeamsInterop): JSX.Element => {
  const history = useRef({
    teamsInteropCurrent: {
      recordingEnabled: false,
      transcriptionEnabled: false
    },
    teamsInteropPrevious: {
      recordingEnabled: false,
      transcriptionEnabled: false
    }
  });

  // Only update history if props differ from the latest snapshot in the history.
  // This avoids jank caused by duplicate renders without any intervening prop update.
  if (
    props.recordingEnabled !== history.current.teamsInteropCurrent.recordingEnabled ||
    props.transcriptionEnabled !== history.current.teamsInteropCurrent.transcriptionEnabled
  ) {
    history.current = {
      teamsInteropCurrent: {
        recordingEnabled: props.recordingEnabled,
        transcriptionEnabled: props.transcriptionEnabled
      },
      teamsInteropPrevious: {
        recordingEnabled: history.current.teamsInteropCurrent.recordingEnabled,
        transcriptionEnabled: history.current.teamsInteropCurrent.transcriptionEnabled
      }
    };
  }

  // Optionally show a message bar for Teams interoperability messages.
  const msg = bannerMessage(history.current);
  if (msg !== null) {
    return <MessageBar>{msg}</MessageBar>;
  }
  return <></>;
};
