# Tips for writing meaningful changelog entries

After running `rush changelog` it will ask you to describe your changes made to each package. Below are some best practices when writing your changelog. Remember, this changelog entry is for package consumers to read and understand what is in a new version they wish to update to.

## Best Practices

* Keep entries concise. Aim for one short sentence and at most two sentences.
* Start with descriptors such as Add, Remove, Fix, Update.
* Use the imperative, present tense. i.e. use Add instead of Adds or Added.
* Only talk about changes to the package the change file is for.
* Use tick marks when naming code items. e.g. `SendBox`, `VideoTile`.
* Avoid detailing the implementation of the change, instead focus on what changed and why it changed.

### Examples

#### Examples of great changelog entries

* Add support for Node v14  (14.19.0 and above)
* Add new feature `typingIndicator`
* Update the number of supported active videos from 3 to 9
* Fix `ParticipantItem` to only show context menu if the participant was not you

#### Examples of poor changelogs entries

* Bug Fix
  > This gives no context to what was fixed or why it was fixed.
* Fix `VideoTile`
  > While this does indicate what component changes it doesn't mention any context as to why a customer cares about that change.
  A better changelog entry would be: Fix `VideoTile` not rendering when a participant joins with video enabled.
* Fixed an issue where the typing indicator would still show even though no one was typing. I fixed it by ensuring the declarative chat client updates the state.
  > This is far too wordy and far too long. Changelogs must be short and to the point. It also talks about the implementation for the fix which is not necessary. A much better example would be: Fix `typingIndicator` showing users who are no longer typing.
