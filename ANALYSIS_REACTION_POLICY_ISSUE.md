# Analysis: Reaction Policy StartCall Issue - Why the Fix May Have Failed

## Executive Summary
The fix in PR #6065 only wrapped `ReactionSubscriber` with error handling, but **multiple other feature subscribers also register listeners that could throw the same policy error (403 subCode 45802)** on Teams-identity outbound Group/PSTN calls.

## Root Cause Analysis

### The Problem Flow
1. **CallSubscriber constructor** is called when `addCall()` is invoked during `startCall`/`join`
2. **Multiple feature subscribers** are created immediately in the constructor
3. Each subscriber registers event listeners by calling `.on()` on its feature
4. **If a listener registration is policy-gated**, the SDK throws: `Error(code=403, subCode=45802, "Unable to register listener due to meeting policy")`
5. **Most subscribers are NOT wrapped with error handling** → Error propagates → Call setup fails

### Current Implementation Issues

**Files**: `packages/calling-stateful-client/src/CallSubscriber.ts`

#### Wrapped with `_safeSubscribe()` (Protected):
- ✅ **ReactionSubscriber** (line 105-108) - Only 1 subscriber protected

#### NOT Wrapped (Vulnerable):
- ❌ **UserFacingDiagnosticsSubscriber** (line 77) - Registers on:
  - `network.on('diagnosticChanged', ...)`
  - `media.on('diagnosticChanged', ...)`
  - `remote.on('diagnosticChanged', ...)` (conditional)
  
- ❌ **RecordingSubscriber** (line 86) - Registers on:
  - `recording.on('isRecordingActiveChanged', ...)`
  
- ❌ **TranscriptionSubscriber** (line 92) - Registers on:
  - `transcription.on('isTranscriptionActiveChanged', ...)`
  
- ❌ **RaiseHandSubscriber** (line 96) - Registers on:
  - `raiseHand.on('raisedHandEvent', ...)`
  - `raiseHand.on('loweredHandEvent', ...)`
  
- ❌ **OptimalVideoCountSubscriber** (line 118) - Registers on:
  - `localOptimalVideoCountFeature.on(...)`
  
- ❌ **CapabilitiesSubscriber** (line 126) - Registers on:
  - `capabilitiesFeature.on('capabilitiesChanged', ...)`
  
- ❌ **SpotlightSubscriber** (line 133) - Registers on:
  - `spotlight.on(...)`
  
- ❌ **BreakoutRoomsSubscriber** (line 139) - Registers on:
  - `breakoutRooms.on(...)`
  
- ❌ **TogetherModeSubscriber** (line 151) - Registers on:
  - `togetherMode.on(...)`
  
- ❌ **MediaAccessSubscriber** (line 154) - Registers on:
  - `mediaAccess.on(...)`

## Why the Fix Failed for the Customer

### Scenario: Teams-Identity Outbound Group/PSTN Call
When a Teams user initiates an outbound group or PSTN call, the Calling SDK applies policy restrictions to optional features. The fix assumed **only reactions** are policy-gated, but **one or more other optional features** might also be restricted.

### Example Failure Scenarios:

**Scenario A: RaiseHand is Also Policy-Gated**
```
1. CallSubscriber constructor starts
2. ReactionSubscriber is created safely (wrapped with _safeSubscribe) ✓
3. RaiseHandSubscriber is created → Throws 403 subCode 45802 ✗
4. Error propagates through withErrorTeedToState wrapper
5. withErrorTeedToState RE-THROWS the error after tee'ing to state
6. startCall() throws → Returns null Call → Failure
```

**Scenario B: UserFacingDiagnosticsSubscriber is Policy-Gated**
```
1. CallSubscriber constructor starts
2. UserFacingDiagnosticsSubscriber is created (line 77)
3. subscribe() calls network.on('diagnosticChanged', ...) → Throws 403 subCode 45802 ✗
4. Error propagates → Call setup fails
```

### Network Evidence from HAR File
- Policy settings fetch was successful (200 OK)
- BUT: Policy settings include `"evEnabled": true` in response
- However, **other features' policy restrictions are NOT captured in network logs**
- Listener registration policy errors happen at the SDK layer, not the network layer

## Root Cause in Code

The implementation assumes the policy error **only** comes from reactions:

```typescript
// CallSubscriber.ts, lines 98-108
// Creating the ReactionSubscriber registers a 'reaction' listener on the Reaction feature.
// That registration is policy-gated by the Calling SDK...
// Wrap it with _safeSubscribe so the error is tee'd to state instead of propagating.
this._safeSubscribe(() => {
  this._reactionSubscriber = new ReactionSubscriber(
    this._callIdRef,
    this._context,
    this._call.feature(Features.Reaction)
  );
});
```

**But above this wrapping** (lines 77-96), other subscribers are created **without protection**:
```typescript
// Line 77: No wrapping!
this._diagnosticsSubscriber = new UserFacingDiagnosticsSubscriber(...);

// Line 86: No wrapping!
this._recordingSubscriber = new RecordingSubscriber(...);

// Line 92: No wrapping!
this._transcriptionSubscriber = new TranscriptionSubscriber(...);

// Line 96: No wrapping!
this._raiseHandSubscriber = new RaiseHandSubscriber(...);
```

## Recommended Fix

All feature subscribers that register listeners during construction should be wrapped with `_safeSubscribe()` because **any optional feature could be policy-gated** in certain call scenarios.

### Proposed Changes

**File**: `packages/calling-stateful-client/src/CallSubscriber.ts`

Wrap all immediate subscriber creations that register listeners:

```typescript
// Line 77: Wrap UserFacingDiagnosticsSubscriber
this._safeSubscribe(() => {
  this._diagnosticsSubscriber = new UserFacingDiagnosticsSubscriber(
    this._callIdRef,
    this._context,
    this._call.feature(Features.UserFacingDiagnostics)
  );
});

// Line 86: Wrap RecordingSubscriber
this._safeSubscribe(() => {
  this._recordingSubscriber = new RecordingSubscriber(
    this._callIdRef,
    this._context,
    this._call.feature(Features.Recording)
  );
});

// Line 92: Wrap TranscriptionSubscriber
this._safeSubscribe(() => {
  this._transcriptionSubscriber = new TranscriptionSubscriber(
    this._callIdRef,
    this._context,
    this._call.feature(Features.Transcription)
  );
});

// Line 96: Wrap RaiseHandSubscriber
this._safeSubscribe(() => {
  this._raiseHandSubscriber = new RaiseHandSubscriber(
    this._callIdRef,
    this._context,
    this._call.feature(Features.RaiseHand)
  );
});

// Line 118: Wrap OptimalVideoCountSubscriber
this._safeSubscribe(() => {
  this._optimalVideoCountSubscriber = new OptimalVideoCountSubscriber({
    callIdRef: this._callIdRef,
    context: this._context,
    localOptimalVideoCountFeature: this._call.feature(Features.OptimalVideoCount)
  });
});

// Line 126: Wrap CapabilitiesSubscriber
this._safeSubscribe(() => {
  this._capabilitiesSubscriber = new CapabilitiesSubscriber(
    this._callIdRef,
    this._context,
    this._call.feature(Features.Capabilities)
  );
});

// Line 133: Wrap SpotlightSubscriber
this._safeSubscribe(() => {
  this._spotlightSubscriber = new SpotlightSubscriber(
    this._callIdRef,
    this._context,
    this._call.feature(Features.Spotlight)
  );
});

// Line 139: Wrap BreakoutRoomsSubscriber
this._safeSubscribe(() => {
  this._breakoutRoomsSubscriber = new BreakoutRoomsSubscriber(
    this._callIdRef,
    this._context,
    this._call.feature(Features.BreakoutRooms)
  );
});

// Line 151: Wrap TogetherModeSubscriber
this._safeSubscribe(() => {
  this._togetherModeSubscriber = new TogetherModeSubscriber(
    this._callIdRef,
    this._context,
    this._internalContext,
    this._call.feature(Features.TogetherMode)
  );
});

// Line 154: Wrap MediaAccessSubscriber
this._safeSubscribe(() => {
  this._mediaAccessSubscriber = new MediaAccessSubscriber(
    this._callIdRef,
    this._context,
    this._call.feature(Features.MediaAccess)
  );
});
```

## Why This Fix Works

1. **Defensive**: Protects against policy errors from ANY optional feature
2. **Consistent**: All feature subscribers use the same error handling pattern
3. **Non-Breaking**: Errors are logged to state but call setup continues
4. **Aligned with Intent**: "optional-feature policy error no longer aborts call setup" (from change file)

## Testing Recommendation

Extend the regression test to verify **ALL** feature subscribers:

```typescript
test('should not fail call setup when any optional feature listener registration is rejected by policy', async () => {
  const features = [
    [Features.Reaction, 'reaction'],
    [Features.RaiseHand, 'raisedHandEvent'],
    [Features.Recording, 'isRecordingActiveChanged'],
    [Features.Transcription, 'isTranscriptionActiveChanged'],
    [Features.Capabilities, 'capabilitiesChanged'],
    // ... and so on
  ];

  for (const [feature, eventName] of features) {
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
      createMockApiFeatures(new Map<any, any>([[feature, mockFeature]]))
    );

    expect(Object.keys(client.getState().calls)).toContain(callId);
    expect(client.getState().latestErrors['Call.on']).toBeDefined();
  }
});
```

## Summary

- **Issue**: Fix is incomplete - only 1 of ~10 feature subscribers is protected
- **Cause**: Assumption that only reactions have policy-gated listeners
- **Impact**: Other optional features can throw 403 subCode 45802 → Call setup still fails
- **Solution**: Wrap ALL feature subscriber creations with `_safeSubscribe()`
- **Scope**: ~10 subscriber creations need wrapping
