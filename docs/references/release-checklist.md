# Release Checklist

## Before Release

Before we release a new version or beta version the following checklist should be completed:

* ✅ Package version updates
  * Ensure packages to be released have the correct version number
* ✅ Release documentation
  * Ensure changelogs have been generated for the released packages
* ✅ Manual and automated tests pass
  * See [Test Plan](#test-plan) below.
* ✅ APIs
  * Ensure no breaking changes to the public APIs
  * Ensure new API changes have sign off from the Azure Review Board

**Releasing is an irreversible action, double check everything is in order before releasing.**

## After Release

* ✅ Verify npm package
  * Ensure the new package is available on npm
  * Ensure the new package has the correct tag (latest, next or dev)
  * Download the package and ensure the bits inside are the same as the ones you intended to publish
  * Use the npm package in a sample app to smoke test there are no issues installing and ingesting the package off npm
* ✅ Verify documentation
  * Ensure the documentation on the public storybook site matches the latest release.
  * Open the storybook site and ensure the console log that lists the npm package version number matches the released package version number.
* ✅ Post about release on the [internal releases Teams channel](https://teams.microsoft.com/l/channel/19%3ae12aa149c0b44318b245ae8c30365880%40thread.skype/ACS%2520Deployment%2520Announcements?groupId=3e9c1fc3-39df-4486-a26a-456d80e80f82&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47).

## Test Plan

The following manual and automated tests should pass before releases.
As our test automation infrastructure improves more manual tests should be converted to automated tests.
These lists are kept up to date as best as possible but may have outdated entries that should be updated.

### Automated Tests

Automated test infrastructure is currently in development.

### Manual Tests

See [internal documentation](https://skype.visualstudio.com/SPOOL/_wiki/wikis/SPOOL.wiki/22634/Deploying-Beta-Candidate-builds-to-Azure-for-Validation)
on how to setup sample apps for manual tests.

| Area | Test |
| -- | -- |
| npm package | User can npm install the npm package |
| npm package | User's app performs treeshaking on the parts of the npm package not used |

| Area | Test |
| -- | -- |
| Call Composite | User can start/stop local video on the configuration page |
| Call Composite | User can mute/unmute mic on the configuration page |
| Call Composite | User can change camera on configuration page |
| Call Composite | User can change microphone on configuration page |
| Call Composite | User can change speaker on configuration page |
| Call Composite | User can join ACS call |
| Call Composite | User can join Teams meeting |
| Call Composite | User can leave call/meeting |
| Call Composite | User can start/stop local video in call |
| Call Composite | User can mute/unmute mic in call |
| Call Composite | User can change camera during the call |
| Call Composite | User can change mic during the call |
| Call Composite | User can change speaker during the call |
| Call Composite | User can start/stop sharing screen in call |
| Call Composite | All other participants in the call should show in the participants view |
| Call Composite | Removed participants from the call should be removed from the participants view |
| Call Composite | User can see other participants video feed |
| Call Composite | User can see other participants sharing screen feed |
| Call Composite | Video tiles show participant name |
| Call Composite | Video tiles show if participant is muted/unmuted |
| Call Composite | A message is shown when teams meeting is starts/stops being recorded/transcribed |

| Area | Test |
| -- | -- |
| Chat Composite | Can join ACS chat |
| Chat Composite | Can join Teams meeting chat |
| Chat Composite | Can send plain text messages with enter key and pressing send button |
| Chat Composite | Messages are ordered by datetime |
| Chat Composite | User's own messages are distinguished from others' messages (blue and to the right) |
| Chat Composite | Sent messages are marked as "sent" if they are sent but have not been read by all other chat members |
| Chat Composite | Sent messages are marked as "read" if they have been read by all other chat members |
| Chat Composite | Sent messages are marked as "error" if they fail to send (e.g. after being removed from a chat) |
| Chat Composite | A typing indicator shows when another user is typing |
| Chat Composite | A typing indicator shows when multiple other users are typing |
| Chat Composite | User avatars show to the left of messages sent by other chat members |
| Chat Composite | The message thread becomes scrollable when the messages surpass the available height |
| Chat Composite | When joining an existing chat with a lot of messages not all messages are fetched |
| Chat Composite | A user can scroll up to retrieve more messages |
| Chat Composite | A participant can be removed from the chat using the participant pane |
| Chat Composite | A removed participant no longer appears in the participant pane |

| Area | Test |
| -- | -- |
| Storybook | tbd |
