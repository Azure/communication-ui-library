## Connect Stateful Client to Redux

Redux is a popular state management framework, it provides a centralized app state. You can easily integrate redux with all popular UI frameworks(React, Angular, VueJs). Developers can eaily integrate our stateful client with redux, and connect redux to their own exisiting framework. 

![Connect with redux](../images/stateful-redux-ui.png)

Here is a quick tutorial for how to connect stateful client state to redux store:
### Install dependencies

```
npm install @azure/communication-react redux
```

### Create a reducer

This reducer of redux help you update the centralized redux store with our client state.

Create a new reducer file in your project path:

#### src\reducer\client.ts

``` typescript
import { ChatClientState } from "@azure/communication-react";

export const UPDATE_CHAT_STATE = 'UPDATE_CHAT_STATE';

export interface UpdateChatState {
    type: typeof UPDATE_CHAT_STATE;
    state: ChatClientState;
};

export const updateChatState = (state: ChatClientState): UpdateChatState => ({
    type: UPDATE_CHAT_STATE,
    state
});

export type ClientActionTypes = UpdateChatState;
```

### Create an action for client state dispatch

Create a new action file:

#### src\action\updateChatState.ts

``` typescript
import { ChatClientState } from "@azure/communication-react";
import { Reducer } from "redux";
import { ClientActionTypes, UPDATE_CHAT_STATE } from "../action/updateChatState";

export interface AppState {
    chatClientState: ChatClientState
}

export const clientStateReducer: Reducer<AppState, ClientActionTypes> = (
    state: AppState,
    action: ClientActionTypes
): AppState => {
    switch (action.type) {
        case UPDATE_CHAT_STATE:
            return { ...state, chatClientState: action.state };
        default:
            return state;
    }
};

```

### Dispatch stateful client update to redux store

Create a file to subscribe stateful client update, please replace all the config strings with your own setup:

#### src\index.ts

``` typescript
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { createStatefulChatClient, StatefulChatClient, ChatClientState } from "@azure/communication-react"
import { UpdateChatState, updateChatState } from './action/updateChatState';
import { clientStateReducer } from './reducer/client';
import { createStore, Dispatch } from 'redux';


export const store = createStore(clientStateReducer);

// Subscribe to client change and dispatch it to redux store
const subscribeToClientChange = (chatClient: StatefulChatClient, dispatch: Dispatch<UpdateChatState>) => {
    chatClient.onStateChange((state: ChatClientState) => {
        dispatch(updateChatState(state));
    });
}

const endpointUrl = '<Azure Communication Services Resource Endpoint>';
const userAccessToken = '<Azure Communication Services Resource Access Token>';
const userId = '<User Id associated to the token>';
const tokenCredential = new AzureCommunicationTokenCredential(userAccessToken);
const threadId = '<Get thread id from chat service>';
const displayName = '<Display Name>';

const chatClient = createStatefulChatClient({
    userId: { kind: 'communicationUser', communicationUserId: userId },
    displayName: displayName,
    endpoint: endpointUrl,
    credential: tokenCredential
});

const chatThreadClient = chatClient.getChatThreadClient(threadId);

subscribeToClientChange(chatClient, store.dispatch);

store.subscribe(() => {
    console.log('redux store is getting updated!');
    console.log(store.getState());
});

chatThreadClient.sendMessage({content: 'Hello Redux!'});

```

### Connect redux with your own UI framework

Now you have an redux store connected with our stateful client, any state update from stateful client will be dispatched to redux store immediately. You can either use [react-redux](https://react-redux.js.org/) or choose your own [binding library](https://redux.js.org/introduction/ecosystem#library-integration-and-bindings) to connect redux to your own UI.