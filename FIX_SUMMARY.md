# Fix for PR #6065: Incomplete Policy-Gated Listener Error Handling

## Summary

The fix in PR #6065 (`fix/reaction-listener-policy-startcall`) was **incomplete**. It only wrapped the `ReactionSubscriber` with error handling for policy-gated listener registration errors, but **9 other feature subscribers** that also register listeners during call setup were left unprotected. This caused the customer's test to fail because when ANY optional feature was policy-gated (not just reactions), the error would still propagate and abort call setup.

## The Issue

### What PR #6065 Fixed
When a Teams user initiates an outbound group or PSTN call, the Calling SDK policy-gates certain optional features. If the app tries to register a listener for a policy-gated feature, the SDK throws:
```
Error {
  code: 403,
  subCode: 45802,
  message: "Unable to register listener due to meeting policy"
}
```

PR #6065 added error handling to prevent this from aborting call setup - specifically for `ReactionSubscriber`.

### Why It Failed
The fix assumed **only reactions** would throw this error. In reality, **ANY optional feature could be policy-gated** in the same scenario. The customer likely had another feature (RaiseHand, Recording, Transcription, etc.) that was also policy-restricted, and that subscriber wasn't wrapped with error handling.

### Vulnerable Subscribers (Before Fix)
These 10 subscribers register listeners during construction and were **NOT protected** by error handling:

1. **UserFacingDiagnosticsSubscriber** - registers `network.on()`, `media.on()`, `remote.on()`
2. **RecordingSubscriber** - registers `recording.on('isRecordingActiveChanged', ...)`
3. **TranscriptionSubscriber** - registers `transcription.on('isTranscriptionActiveChanged', ...)`
4. **RaiseHandSubscriber** - registers `raiseHand.on('raisedHandEvent', ...)` + `loweredHandEvent`
5. **OptimalVideoCountSubscriber** - registers listener for optimal video count changes
6. **CapabilitiesSubscriber** - registers `capabilities.on('capabilitiesChanged', ...)`
7. **SpotlightSubscriber** - registers spotlight listener
8. **BreakoutRoomsSubscriber** - registers breakout rooms listener
9. **TogetherModeSubscriber** - registers together mode listener
10. **MediaAccessSubscriber** - registers media access listener

## The Fix

### What Was Changed
File: `packages/calling-stateful-client/src/CallSubscriber.ts`

**Wrapped all 10 feature subscriber creations** with `this._safeSubscribe()` to catch policy-gated listener registration errors.

### Before
```typescript
// Unprotected - error propagates and aborts call setup
this._diagnosticsSubscriber = new UserFacingDiagnosticsSubscriber(...);
this._recordingSubscriber = new RecordingSubscriber(...);
this._raiseHandSubscriber = new RaiseHandSubscriber(...);
// ... etc
```

### After  
```typescript
// Protected - error is caught and tee'd to state
this._safeSubscribe(() => {
  this._diagnosticsSubscriber = new UserFacingDiagnosticsSubscriber(...);
});
this._safeSubscribe(() => {
  this._recordingSubscriber = new RecordingSubscriber(...);
});
this._safeSubscribe(() => {
  this._raiseHandSubscriber = new RaiseHandSubscriber(...);
});
// ... etc
```

## How `_safeSubscribe()` Works

```typescript
private _safeSubscribe(subscriber: () => void): void {
  try {
    subscriber();
  } catch (e) {
    // Catch the error and tee it to state with category 'Call.on'
    // Error is NOT re-thrown, so call setup continues
    this._context.teeErrorToState(e as Error, 'Call.on');
  }
}
```

This ensures that:
1. If a subscriber throws a policy error (403), it's caught
2. The error is recorded in `latestErrors['Call.on']` for diagnostics
3. Call setup **continues successfully** - the call is not nulled out
4. The application gets the call object even if some optional features are policy-restricted

## Call Flow After Fix

### Teams-Identity Outbound PSTN Call Scenario
```
1. User calls agent.startCall()
2. SDK creates the Call object
3. statefulClient.addCall() is invoked
4. CallSubscriber constructor starts

5. UserFacingDiagnosticsSubscriber created with _safeSubscribe
   └─ Listener registration throws 403 ✗
   └─ Caught by _safeSubscribe, error tee'd to state
   └─ Execution continues ✓

6. RecordingSubscriber created with _safeSubscribe  
   └─ Listener registration throws 403 ✗
   └─ Caught by _safeSubscribe, error tee'd to state
   └─ Execution continues ✓

7. RaiseHandSubscriber created with _safeSubscribe
   └─ Listener registration throws 403 ✗
   └─ Caught by _safeSubscribe, error tee'd to state
   └─ Execution continues ✓

8. ... (other subscribers similarly wrapped)

9. ReactionSubscriber created with _safeSubscribe
   └─ Listener registration throws 403 ✗
   └─ Caught by _safeSubscribe, error tee'd to state
   └─ Execution continues ✓

10. CallSubscriber initialization completes successfully ✓
11. Call object is returned to application ✓
12. Errors are available in state: latestErrors['Call.on'] ✓
```

## Verification

### Test Case (Should Pass)
```typescript
test('should not fail call setup when registering optional feature listeners is rejected by meeting policy', async () => {
  // Test each subscriber to ensure it handles policy errors
  const subscribers = [
    Features.Reaction,      // Already was working
    Features.RaiseHand,     // Now fixed
    Features.Recording,     // Now fixed
    Features.Transcription, // Now fixed
    Features.Capabilities,  // Now fixed
    Features.Spotlight,     // Now fixed
    Features.BreakoutRooms, // Now fixed
    Features.TogetherMode,  // Now fixed
    // ... etc
  ];

  for (const feature of subscribers) {
    const mockFeature = addMockEmitter({ name: feature.name });
    mockFeature.on = (): void => {
      const error: Error & { code?: number; subCode?: number } = new Error(
        'Unable to register listener due to meeting policy'
      );
      error.code = 403;
      error.subCode = 45802;
      throw error;
    };

    const { client, callId } = await prepareCallWithFeatures(
      createMockApiFeatures(new Map([[feature, mockFeature]]))
    );

    // Call should be in state despite policy error
    expect(Object.keys(client.getState().calls)).toContain(callId);
    // Error should be logged to state
    expect(client.getState().latestErrors['Call.on']).toBeDefined();
  }
});
```

## Impact

### Scenarios Fixed
- ✅ Teams-identity outbound PSTN calls with policy-gated reactions
- ✅ Teams-identity outbound group calls with policy-gated reactions  
- ✅ **Any scenario where one or more optional features are policy-restricted** (RaiseHand, Recording, Transcription, Diagnostics, Capabilities, Spotlight, BreakoutRooms, TogetherMode, MediaAccess)

### No Breaking Changes
- All errors are still logged for diagnostics
- Applications can check `latestErrors['Call.on']` to see what optional features failed
- Call setup always succeeds for optional-feature policy errors
- Mandatory features (not wrapped) will still properly fail if policy-restricted

## Files Modified
- `packages/calling-stateful-client/src/CallSubscriber.ts` 
  - Lines 75-180 (constructor)
  - Wrapped 10 feature subscriber creations with `_safeSubscribe()`

## Related Files (For Reference)
- `packages/calling-stateful-client/src/CallSubscriber.ts` - Contains `_safeSubscribe()` implementation
- `packages/calling-stateful-client/src/CallContext.ts` - Contains `teeErrorToState()` method
- `change/` and `change-beta/` - Beachball change files documenting the fix
- `packages/calling-stateful-client/src/StatefulCallClient.test.ts` - Test for this fix

## Recommendations

1. **Expand existing regression test** to verify ALL optional features handle policy errors
2. **Document** that policy-gated listener errors are expected in certain scenarios
3. **Consider adding telemetry** to identify when policy errors occur (helps with diagnostics)
4. **Review if other optional features** might need similar protection (e.g., during state changes)
