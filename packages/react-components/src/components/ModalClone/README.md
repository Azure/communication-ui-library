# Information on ModalClone

ModalClone is a direct clone of https://github.com/microsoft/fluentui/blob/b7f17e976f9e058f39c9fce4f0f9bb6eb4dfa577/packages/react/src/components/Modal/Modal.ts

The only alteration to these files is that the `FocusTrapZone` inside `ModalBase` has the prop `disabled` set to `true`.

This is to workaround a Fluent A11y bug where the modal is stealing focus and not letting a user keyboard navigate outside the modal: https://github.com/microsoft/fluentui/issues/18924

Once this is resolved delete both `ModalClone.tsx`.
