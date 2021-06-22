# Handling and reporting errors

    WARNING: This document describes future plans for error handling.
    The UI library does not (yet) implement error handling as described here.

This document describes how errors are handled within the ACS UI library and how they are reported to the surrounding application.

Different error handling strategies are employed when using the composites or the components library. Let's look at each in turn.

## Components library

An application built using the components library uses the stateful clients to make REST calls to the Azure Communication Services backends. It uses the pure UI components and the component bindings package to connect the UI components to the stateful clients.

* Errors generated from REST calls to the Azure Communication Services backend or the underlying SDK are caught by the stateful client. The next section describes this mechanism in detail.
* Errors generated within the UI library packages are _unexpected_ (i.e., they are the result of a programming error in the UI library). Neither the end-user nor the surrounding application is expected to act on the errors. Thus, they aren't handled in the library. The recommended way to handle these errors is to use React `ErrorBoundary`.

      **TODO: Add storybook example of using ErrorBoundary**

### Error handling in stateful clients

Handling Azure Communication Services backend errors is challenging because:

* Backend API calls are asynchronous
* Backend API calls are often initiated outside of the React component lifecycle methods (e.g on interaction handler callbacks or `useEffect` blocks).

But in both cases, all backend API calls are mediated by the (chat and calling) stateful clients. The stateful client tees errors to a special field in the state:

```ts
interface CallClientState {
    // ... other fields ...
    errors: { [key: SdkClientMethod]: ErrorState[] };
}

type SdkClientMethod = 'CallClient.createCallAgent' | 'CallClient.getDeviceManager'; // ... and many more

interface ErrorState {
    /**
     * Locally generated unique ID for error.
     * Allows for de-duplicating similar errors from repeated API calls.
     */
    id: string;
    error: Error;
}
```

Stateful client API method calls continue to return errors (e.g. as a failed promise). So they can be handled directly as well.

The stateful clients stores the most recent errors per method, evicting older errors if necessary. The number of errors stored can be configured, or set to -1 to disable deletion of older errors. e.g., the composites disable error eviction in the stateful client and delete older errors themselves. By default, only the most recent error is stored.

The errors in the state enables UI library components that act on some errors (e.g., disabling `SendBox` in case no messages can be sent), components that surface UI errors, and adapter implementations that generate error events for the surrounding application.

#### Clearing errors

Errors in the state are cleared in one of two ways:

* Application clears the errors via a new Stateful client method.

  ```ts
  interface StatefulChatClient {
      // ... Other methods
      clearErrors(method: SdkClientMethod): void;
  }
  ```

* If a previously failed method is retried and succeeds, the stateful client clears the errors on that (and sometimes related) method.

In both cases, all errors on relevant methods are cleared.

### Surfacing errors to UI

The ACS UI library includes an error bar component and corresponding react component bindings to surface some of the errors from the state on the UI. Surfaced errors include:

* For chat:
  * Failure to connect to ACS backend ("you are offline").
  * Permission error when connecting to ACS backend.
  * Permission error for a particular thread (user not in the thread).
  * Sending messages throttled by ACS backend (temporary error).
* For calling:
  * Permission error when connecting to ACS backend.
  * Permission error in using local devices (microphone, speaker, camera).

## Composites library

In the composites library, the Adapter API provides an abstraction for all the state and business logic required for the UI. The adapter API is decoupled from the components library, but the default implementation uses the UI component and stateful packages.

Error handling in the composites library follows the same principles as the components library but is decoupled from the exact types.

* The adapter API includes an `errors` field, with similar semantics to the stateful client described above. The expectation is that all errors generated in the implementation of the adapter are teed to the `errors` field. The adapter API also reports the error to the surrounding application via an `on('error')` event.
  * In the default implementation of the adapter API, the `errors` field is a generated from the stateful `errors` fields. Additional errors not generated in the stateful client may be added. An `adaptedSelector` is used to transform the error back into the correct shape for the `ErrorBar` and other components.
* Errors generated in the UI components are not handled. The recommended way to handle these errors is to use React `ErrorBoundary`.

Composites surface errors to the UI using the `ErrorBar` component from the components library.

## Error flow diagram

The following diagram describes how en error in sending a message flows throw an application for the default implementation of `ChatComposite`. The application uses the `ChatComposite`, which includes the `SendBox` and `ErrorBar` components.

    Application                     ChatComposite                        StatefulChatClient                  Chat backend
    ===========                     =============                        ==================                  ============

                                    SendBox  ───────────────────────────► async   ─────────────────────────►  sendMessage
                                        .sendMessageOnClick()              sendMessage()                       REST call
                                                                                                                    │
                                                                                                                    ▼
                                    Failed promise error                  async                               sendMessage
                                        ignored.         ◄───────────────  sendMessage()   ◄────────────────── REST call
                                                                           returns failed promise              fails
                                                                                    │
                                                                            &&      │
                                                                                    ▼
                                                                           updates ChatState.errors
                                                                                    │
                                                                                    │
                                                                                    ▼
                                    adaptedErrorBarSelector ◄───────────── onStateChange() event
                                        extracts error                         with new error
                                        and updates error bar UI
                                                │
                                     &&         │
                                                ▼
                                    updates adapter.state.errors
                                                │
                                     &&         │
                                                ▼
    Custom error handling◄────────── triggers on('error', handler)
    logic

* `SendBox.sendMessageOnClick()` handler runs when the user clicks on a button, outside Reach component lifecycle.
* The asynchronously returned error is dropped by the handler.
* But the error is also persisted by the stateful client.
  * The `ErrorBar` gets updated based on the state update.
  * The `ChatComposite` also updates its own internal state and triggers an event that the application acts on.

## Browser compatibility

A special case of errors are errors due to browser incompatibility.

* The Azure Communication Services SDKs only support some OS platform and browser configurations. Thus, the components library may not work correctly on other browser (versions).
* Default implementation of the adapter API in the composite library has the same limitation.
* A custom implementation of the adapter API might have it's own browser support limitations.

The surrounding application may have a more restrictive browser support matrix due to other dependencies and its own way to notify the user of supported browsers. The application may even use polyfills to prevent the errors. Thus, the UI library does not determine browser compatibility at runtime.

e.g., the samples included in this repository are built atop the Azure Communication Services SDKs and include a browser compatibility check.

    TODO: Actually add the browser compatibility check in the sample apps.
