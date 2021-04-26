import { MessageBar } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { bannerMessage, TeamsInterop } from './TeamsInterop.snippet';

export const Banner = (props: TeamsInterop): JSX.Element => {
  const [history, setHistory] = useState({
    teamsInteropCurrent: {
      recordingEnabled: false,
      transcriptionEnabled: false
    },
    teamsInteropPrevious: {
      recordingEnabled: false,
      transcriptionEnabled: false
    }
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  // Only update history if props differ from the latest snapshot in the history.
  // This avoids an infinite rendering loop due to state updates and jank due to duplicate prop updates.
  useEffect(() => {
    if (
      props.recordingEnabled === history.teamsInteropCurrent.recordingEnabled &&
      props.transcriptionEnabled === history.teamsInteropCurrent.transcriptionEnabled
    ) {
      return;
    }

    setHistory({
      teamsInteropCurrent: {
        recordingEnabled: props.recordingEnabled,
        transcriptionEnabled: props.transcriptionEnabled
      },
      teamsInteropPrevious: {
        recordingEnabled: history.teamsInteropCurrent.recordingEnabled,
        transcriptionEnabled: history.teamsInteropCurrent.transcriptionEnabled
      }
    });
  });
  /* eslint-enable react-hooks/exhaustive-deps */

  // Optionally show a message bar for Teams interoperability messages.
  const msg = bannerMessage(history);
  if (msg !== null) {
    return <MessageBar>{msg}</MessageBar>;
  }
  return <></>;
};
