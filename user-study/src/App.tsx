import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  CallAdapter,
  createAzureCommunicationCallAdapter,
  ChatAdapter,
  createAzureCommunicationChatAdapter,
  CallComposite
} from '@azure/communication-react';
import React, { useEffect, useMemo, useState } from 'react';

import CustomMuteIcon from './custom-muted-icon.png';

function App(): JSX.Element {
  const endpointUrl = 'https://acs-ui-dev.communication.azure.com/';
  const userId = '8:acs:71ec590b-cbad-490c-99c5-b578bdacde54_0000000d-c563-6e53-f6c7-593a0d001492';
  const displayName = 'Anjul Garg';
  const token =
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwMyIsIng1dCI6Ikc5WVVVTFMwdlpLQTJUNjFGM1dzYWdCdmFMbyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjcxZWM1OTBiLWNiYWQtNDkwYy05OWM1LWI1NzhiZGFjZGU1NF8wMDAwMDAwZC1jNTYzLTZlNTMtZjZjNy01OTNhMGQwMDE0OTIiLCJzY3AiOjE3OTIsImNzaSI6IjE2MzcwMTE4MDIiLCJleHAiOjE2MzcwOTgyMDIsImFjc1Njb3BlIjoidm9pcCIsInJlc291cmNlSWQiOiI3MWVjNTkwYi1jYmFkLTQ5MGMtOTljNS1iNTc4YmRhY2RlNTQiLCJpYXQiOjE2MzcwMTE4MDJ9.gLMW9ppspS_xV58X5_ZGji-mmqJimYx4T1zLqMOQN--cIbLN9Pk9UG5H-_bnUz4ok0WFdtgJcsWeijnB6x0gFN0Qs7Ar7Zl7mG7RWsQNriiMhodHXsh3oS-ZPLHZEGBDV3qfGqCeSjyz9JOr1iD0IbNEGGrG3CJjEh0STkJ9I0aOfOW1FmhZWLEWIR1E3hv_DQDd2GVMhTQKgvvn84Rq13BSHcI0UUzLY5eDiM9_kjjFleUqldou3pxwZRZn2csFa3Z3iKnE5efEXGLN4zoaXP_hQDqyXa_BX7TlqO2UR-S6WzbOFbQeeZuAQWLvvSiznUDdTTdCQodQVniK0pH-zA';

  //Calling Variables
  //For Group Id, developers can pass any GUID they can generate
  const groupId = '1f4940c5-4dad-42e0-a630-98abb5ffa17f';
  const [callAdapter, setCallAdapter] = useState<CallAdapter>();

  //Chat Variables
  const threadId = '<Get thread id from chat service>';
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter>();

  // We can't even initialize the Chat and Call adapters without a well-formed token.
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [token]);

  useEffect(() => {
    if (credential !== undefined) {
      const createAdapter = async (credential: AzureCommunicationTokenCredential): Promise<void> => {
        setChatAdapter(
          await createAzureCommunicationChatAdapter({
            endpointUrl,
            userId: { communicationUserId: userId },
            displayName,
            credential,
            threadId
          })
        );
        setCallAdapter(
          await createAzureCommunicationCallAdapter({
            userId: { communicationUserId: userId },
            displayName,
            credential,
            locator: { groupId }
          })
        );
      };
      createAdapter(credential);
    }
  }, [credential]);

  if (!!callAdapter && !!chatAdapter) {
    return (
      <div className="wrapper">
        <CallComposite adapter={callAdapter} />
      </div>
    );
  }
  if (credential === undefined) {
    return <h3>Failed to construct credential. Provided token is malformed.</h3>;
  }
  return <h3>Initializing...</h3>;
}

export default App;
