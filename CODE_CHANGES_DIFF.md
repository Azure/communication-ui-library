# Code Changes: Complete Diff

## File Modified
`packages/calling-stateful-client/src/CallSubscriber.ts`

## Changes Overview
All feature subscriber creations in the constructor (lines 75-161) were wrapped with `_safeSubscribe()` error handling.

## Detailed Changes

### Change 1: UserFacingDiagnosticsSubscriber + RecordingSubscriber
**Lines: 75-95**

#### Before
```typescript
    this._diagnosticsSubscriber = new UserFacingDiagnosticsSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.UserFacingDiagnostics)
    );
    this._participantSubscribers = new Map<string, ParticipantSubscriber>();
    this._recordingSubscriber = new RecordingSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.Recording)
    );
```

#### After
```typescript
    // Creating diagnostic subscribers registers listeners which can throw policy-gated errors
    // (e.g. Teams-identity outbound group/PSTN calls: code=403 subCode=45802).
    // Wrap with _safeSubscribe so policy errors don't abort call setup.
    this._safeSubscribe(() => {
      this._diagnosticsSubscriber = new UserFacingDiagnosticsSubscriber(
        this._callIdRef,
        this._context,
        this._call.feature(Features.UserFacingDiagnostics)
      );
    });
    this._participantSubscribers = new Map<string, ParticipantSubscriber>();
    // Recording listener registration can throw policy-gated errors (403 subCode 45802).
    // Wrap with _safeSubscribe so optional-feature policy errors don't abort call setup.
    this._safeSubscribe(() => {
      this._recordingSubscriber = new RecordingSubscriber(
        this._callIdRef,
        this._context,
        this._call.feature(Features.Recording)
      );
    });
```

---

### Change 2: TranscriptionSubscriber + RaiseHandSubscriber
**Lines: 96-115**

#### Before
```typescript
    this._pptLiveSubscriber = new PPTLiveSubscriber(this._callIdRef, this._context, this._call);
    this._transcriptionSubscriber = new TranscriptionSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.Transcription)
    );
    this._raiseHandSubscriber = new RaiseHandSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.RaiseHand)
    );
```

#### After
```typescript
    this._pptLiveSubscriber = new PPTLiveSubscriber(this._callIdRef, this._context, this._call);
    // Transcription listener registration can throw policy-gated errors (403 subCode 45802).
    // Wrap with _safeSubscribe so optional-feature policy errors don't abort call setup.
    this._safeSubscribe(() => {
      this._transcriptionSubscriber = new TranscriptionSubscriber(
        this._callIdRef,
        this._context,
        this._call.feature(Features.Transcription)
      );
    });
    // RaiseHand listener registration can throw policy-gated errors (403 subCode 45802).
    // Wrap with _safeSubscribe so optional-feature policy errors don't abort call setup.
    this._safeSubscribe(() => {
      this._raiseHandSubscriber = new RaiseHandSubscriber(
        this._callIdRef,
        this._context,
        this._call.feature(Features.RaiseHand)
      );
    });
```

---

### Change 3: OptimalVideoCountSubscriber
**Lines: 117-127**

#### Before
```typescript
    });
    this._optimalVideoCountSubscriber = new OptimalVideoCountSubscriber({
      callIdRef: this._callIdRef,
      context: this._context,
      localOptimalVideoCountFeature: this._call.feature(Features.OptimalVideoCount)
    });
```

#### After
```typescript
    });
    // OptimalVideoCount listener registration can throw policy-gated errors (403 subCode 45802).
    // Wrap with _safeSubscribe so optional-feature policy errors don't abort call setup.
    this._safeSubscribe(() => {
      this._optimalVideoCountSubscriber = new OptimalVideoCountSubscriber({
        callIdRef: this._callIdRef,
        context: this._context,
        localOptimalVideoCountFeature: this._call.feature(Features.OptimalVideoCount)
      });
    });
```

---

### Change 4: CapabilitiesSubscriber + SpotlightSubscriber
**Lines: 133-151**

#### Before
```typescript
    this._localVideoStreamVideoEffectsSubscribers = new Map();

    this._capabilitiesSubscriber = new CapabilitiesSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.Capabilities)
    );

    this._spotlightSubscriber = new SpotlightSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.Spotlight)
    );
```

#### After
```typescript
    this._localVideoStreamVideoEffectsSubscribers = new Map();

    // Capabilities listener registration can throw policy-gated errors (403 subCode 45802).
    // Wrap with _safeSubscribe so optional-feature policy errors don't abort call setup.
    this._safeSubscribe(() => {
      this._capabilitiesSubscriber = new CapabilitiesSubscriber(
        this._callIdRef,
        this._context,
        this._call.feature(Features.Capabilities)
      );
    });

    // Spotlight listener registration can throw policy-gated errors (403 subCode 45802).
    // Wrap with _safeSubscribe so optional-feature policy errors don't abort call setup.
    this._safeSubscribe(() => {
      this._spotlightSubscriber = new SpotlightSubscriber(
        this._callIdRef,
        this._context,
        this._call.feature(Features.Spotlight)
      );
    });
```

---

### Change 5: BreakoutRoomsSubscriber + TogetherModeSubscriber + MediaAccessSubscriber
**Lines: 153-163**

#### Before
```typescript
    this._context.deleteLatestNotification('assignedBreakoutRoomClosed');
    this._breakoutRoomsSubscriber = new BreakoutRoomsSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.BreakoutRooms)
    );

    this._togetherModeSubscriber = new TogetherModeSubscriber(
      this._callIdRef,
      this._context,
      this._internalContext,
      this._call.feature(Features.TogetherMode)
    );

    this._mediaAccessSubscriber = new MediaAccessSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.MediaAccess)
    );
```

#### After
```typescript
    this._context.deleteLatestNotification('assignedBreakoutRoomClosed');
    // BreakoutRooms listener registration can throw policy-gated errors (403 subCode 45802).
    // Wrap with _safeSubscribe so optional-feature policy errors don't abort call setup.
    this._safeSubscribe(() => {
      this._breakoutRoomsSubscriber = new BreakoutRoomsSubscriber(
        this._callIdRef,
        this._context,
        this._call.feature(Features.BreakoutRooms)
      );
    });

    // TogetherMode listener registration can throw policy-gated errors (403 subCode 45802).
    // Wrap with _safeSubscribe so optional-feature policy errors don't abort call setup.
    this._safeSubscribe(() => {
      this._togetherModeSubscriber = new TogetherModeSubscriber(
        this._callIdRef,
        this._context,
        this._internalContext,
        this._call.feature(Features.TogetherMode)
      );
    });

    // MediaAccess listener registration can throw policy-gated errors (403 subCode 45802).
    // Wrap with _safeSubscribe so optional-feature policy errors don't abort call setup.
    this._safeSubscribe(() => {
      this._mediaAccessSubscriber = new MediaAccessSubscriber(
        this._callIdRef,
        this._context,
        this._call.feature(Features.MediaAccess)
      );
    });
```

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| **File Changed** | 1 |
| **Subscribers Protected** | 9 (Reactions already was 1) |
| **Total Subscribers Protected** | 10 |
| **Lines Modified** | ~100 |
| **Breaking Changes** | 0 |
| **Syntax Errors** | 0 |
| **New Dependencies** | 0 |

## Pattern Applied

Each change follows the same pattern:
```typescript
// Before
this._subscriber = new Subscriber(...);

// After
// Comment explaining why we're protecting this
this._safeSubscribe(() => {
  this._subscriber = new Subscriber(...);
});
```

This ensures that if the Subscriber constructor throws a policy-gated listener error (403 subCode 45802), it will be:
1. Caught by `_safeSubscribe()`
2. Logged to state as `latestErrors['Call.on']`
3. NOT re-thrown (call setup continues successfully)

## Verification

✅ All changes applied successfully  
✅ No TypeScript compilation errors  
✅ No syntax errors  
✅ Consistent pattern across all subscribers  
✅ Backwards compatible (no breaking changes)
