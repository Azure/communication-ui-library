import { GroupCall, GroupChat } from '@azure/communication-ui';
import React from 'react';

function App(): JSX.Element {
  return (
    <>
      {/* Example styling provided, developers can provide their own styling to position and resize components */}
      <div style={{ height: '35rem', width: '50rem', float: 'left' }}>
        <GroupCall
          userId={'USERID'}
          displayName={'DISPLAY_NAME'} /* Required, Display name for the user entering the call */
          token={
            'TOKEN'
          } /* Required, Azure Communication Services access token retrieved from authentication service */
          refreshTokenCallback={async () => {
            return 'CALLBACK';
          }} /* Optional, Callback to refresh the token in case it expires */
          groupId={'GROUPID'} /* Required, Id for group call that will be joined. (GUID) */
          onEndCall={() => {
            {
              /* Optional, Action to be performed when the call ends */
            }
          }}
        />
      </div>

      {/*Note: Make sure that the userId associated to the token has been added to the provided threadId*/}
      {/* Example styling provided, developers can provide their own styling to position and resize components */}
      <div style={{ height: '35rem', width: '30rem', float: 'left' }}>
        <GroupChat
          displayName={'DISPLAY_NAME'} /* Required, Display name for the user entering the call */
          token={
            'TOKEN'
          } /* Required, Azure Communication Services access token retrieved from authentication service */
          threadId={'THREADID'} /* Required, Id for group chat thread that will be joined */
          endpointUrl={
            'ENDPOINT_URL'
          } /* Required, URL for Azure endpoint being used for Azure Communication Services */
          onRenderAvatar={(userId) => {
            /* Optional, function to override the avatar image on the chat thread. Function receives one parameters for the Azure Communication Services Identity. Must return a React element */
            return <h1>Sample Element</h1>;
          }}
          refreshTokenCallback={async () => {
            /* Optional, function to refresh the access token in case it expires */
            return 'CALLBACK';
          }}
          options={
            {
              /* Optional, options to define chat behavior
            sendBoxMaxLength: number | undefined  Optional, Limit the max send box length based on viewport size change */
            }
          }
        />
      </div>
    </>
  );
}

export default App;
