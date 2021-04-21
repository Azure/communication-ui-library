# Comparison of potential APIs for a Composite

This is the attempt at a somewhat methodical and brief comparison for different API designs around Composites.

They have different trade-offs in terms of how intuitive they feel and what they enable. Parts with ??? don't mean impossible but "couldn't think of a way to do this at the top of my head with this approach".

## MVVM-ish with a manager class

```typescript
// render
groupCall = new GroupCall();
jsxElement = groupCall.createView(customizationOptions)

// send commands
groupCall.mute()
groupCall.stopCamera()

// query
muted = groupCall.isMuted

// events
groupCall.on('participantJoined', handler);

// rewire event handling
groupCall.on('beforeMute', () => 'continue' | 'abort');
```

## JSX-style

```typescript
// render
<GroupCall {…customizationOptions} {…eventHandlers} />

// send commands
???

// query
? store payload from each raised event

// events
onParticipantJoined passed via props

// rewire event handling
onBeforeMute event: () => 'continue' | 'abort';
```

## JSX-style with full composite State

```typescript
// render
<GroupCall {…customizationOptions} onStateChange={handler} />

// send commands
???

// query
? store state from latest event, then state.isMuted

// events
onStateChange, then developer has to diff with previous state

// rewire event handling
???

```

## JSX-style with Adapter

```typescript
// render
<GroupCall callingAdapter={} {…customizationOptions} />

// send commands
adapter.mute()
adapter.stopCamera()

// query
? store state from latest event, then state.isMuted

// events
adapter.onStateChange, then developer has to diff with previous state
or also onStateChange event on GroupCall

// rewire event handling
override or decorate adapter.mute() function
```

## JSX-style with selector and handlers

```typescript
// render
const client = declaratify(new CallingClient(new AzureCommunicationTokenCredential(token)));
const agent = await client.createCallAgent();
<CallingProvider client={client} agent={agent}>
  () => {
  const selectedProps = useSelector(GroupCall);
  const handlers = useHandlers(GroupCall);
  return <GroupCall {…selectedProps} {…handlers}  {…customizationOptions} />
  }
</CallingProvider>

// send commands
???

// query
? store payload from each raised event

// events
override or decorate handlers

// rewire event handling
override or decorate onMute handler
```
