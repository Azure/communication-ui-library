# 1:N Calling Web - ADR

**Date:** 19th May, 2022 </br>
**Proposed By:** Anjul Garg <anjulgarg@microsoft.com>

A 1:1 call is a voice/video call between an Azure Communication user and another Azure Communication Services or Microsoft Teams user.

Similarly, a 1:N call is a voice/video call between an Azure Communication user and a multiple Azure Communication Services or Microsoft Teams users.

A caller may choose to start the call with multiple receivers or add multiple receivers to an existing call.

## ADR 1: UI Components

1:N Calling implementation requires new components to be introduced to the UI Library as well as existing components with some needing modifications.

### Decision

**New UI components:**
- **Hold button (Public)** - A button for putting the call on hold and then resuming (un-holding) the call. The button's initial icon to be a pause icon. When the call is on hold, the button's icon changes to a play icon.
- **Incoming call indicator (Internal)** - An incoming call alert modal that appears when an incoming call is received. Multiple incoming calls to display multiple such alerts. A user can toggle their local video, accept the call and/or decline the call using this component. Accepting the call takes a user to the call screen. Declining the call hides the alert.

**Existing UI Components:**
- **Video Tile** - The VideoTile component doesn't require changes. It will be used to display the video/avatar placeholder of all the participants in the call. If a participant is added to the call and is not connected to the call, transient states like `ringing` and `connecting` will be displayed in the video tile by utilizing the `VideoTile.renderElement` prop. The `VideoGallery` component will inject a custom JSX Element to change the content of participant's video tile to depict these transient states.

**UI Components to be modified:**
- **Video Gallery** - 1:N Calling allows a user to add participants during an ongoing call. The VideoGallery component needs to be modified to display the video/avatar placeholder and the transient states of all the participants in the call. If a participant is added to the call and is not connected to the call, transient states like `ringing` and `connecting` will be displayed in the video tile by utilizing the `VideoTile.renderElement` prop. The proposed modification is internal and doesn't affect VideoGallery's public props.

### Rationale

The initial development is focused around delivering a 1:N Calling experience using UI Components without utilizing Composites.

### Status

PROPOSED

### Conequences

We will require design support if we choose to publically export a default incoming call alert component.

## ADR 2: Stateful Calling Client
### Decision
### Rationale
### Status
[Proposed | Accepted | Deprecated | Superseded]
### Conequences

## FAQs