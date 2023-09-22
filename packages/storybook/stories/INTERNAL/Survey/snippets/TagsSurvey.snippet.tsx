// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PrimaryButton } from '@fluentui/react';
import { _TagsSurvey as TagsSurvey,_AudioIssue,_OverallIssue,_ScreenshareIssue,_SurveyTag, _VideoIssue} from '@internal/react-components';
import React, { useState } from 'react';

export const TagsSurveyExample: () => JSX.Element = () => {
  const [showSurvey, setShowSurvey] = useState(false);
  const onDismiss = (): void => {
    setShowSurvey(false);
  };

  const strings = {
   TagsSurveyQuestion: "What could have been better?",
   TagsSurveyConfirmButtonLabel: 'Submit Survey',
     TagsSurveyCancelButtonLabel: 'Cancel',
   cancelButtonAriaLabel: 'Cancel'
  };

  const callIssuesToTag = {
    overallRating: {
      CallCannotJoin: "I could not join call",
      CallCannotInvite:"I could not invite others into the call",
      HadToRejoin: "I had to rejoin the call",
      CallEndedUnexpectedly: "Call ended for me unexpectedly",
      OtherIssues: "I was having other issues with the call"
    },
    audioRating: {
      NoLocalAudio: "The other side could not hear any sound",
      NoRemoteAudio: "I could not hear any sound",
      Echo: "I heard echos on the call",
      AudioNoise:"I heard noise on the call",
      LowVolume: "Volume was low",
      AudioStoppedUnexpectedly: "Audio stopped unexpectedly",
      DistortedSpeech: "Audio was distorted",
      AudioInterruption: "Audio was interrupted",
      OtherIssues: "I was having other audio issues in this call"
    },
    videoRating: {
      NoVideoReceived: "I could not see any video",
      NoVideoSent: "Others could not see me",
      LowQuality: "Video quality was low",
      Freezes: "Video frozen",
      StoppedUnexpectedly: "Video stopped unexpectedly",
      DarkVideoReceived: "I can only see dark screens when others turn on their camera",
      AudioVideoOutOfSync: "Audio and Video was out of sync",
      OtherIssues: "I was having other video issues in this call"
    },
    screenshareRating: {
      NoContentLocal: "Other people could not see my screenshare",
     NoContentRemote:"I could not see other people's screenshare",
      CannotPresent: "I could not present my screen", 
      LowQuality: "Screen share quality was low",
      Freezes: "Screen share frozen",
      StoppedUnexpectedly: "Screen share stopped unexpectedly",
      LargeDelay: "Screen share has a large delay",
      OtherIssues: "I was having other screen share issues in this call"
    }
  }

  const issues:(_AudioIssue | _OverallIssue | _ScreenshareIssue | _VideoIssue)[] = ['AudioInterruption','AudioNoise','AudioStoppedUnexpectedly','CallCannotInvite','CallCannotJoin','CallEndedUnexpectedly','CannotPresent','DarkVideoReceived','DistortedSpeech','Echo','Freezes']


  return (
    <>
      <PrimaryButton onClick={() => setShowSurvey(true)}> Open Survey</PrimaryButton>
      {showSurvey && <TagsSurvey onDismissTagsSurvey={onDismiss} strings={strings} issues={issues} callIssuesToTag={callIssuesToTag} />}
    </>
  );
};
