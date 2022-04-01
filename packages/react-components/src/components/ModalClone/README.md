# Information on ModalClone

ModalClone is a direct clone of https://github.com/microsoft/fluentui/blob/b7f17e976f9e058f39c9fce4f0f9bb6eb4dfa577/packages/react/src/components/Modal/Modal.ts

This has two deviations from Fluent's Modal:
1. The `FocusTrapZone` inside `ModalBase` has the prop `disabled` set to `true`.
    This is to workaround a Fluent A11y bug where the modal is stealing focus and not letting a user keyboard navigate outside the modal: https://github.com/microsoft/fluentui/issues/18924
2. The Modal interface has been extended to allow setting the min and max draggable bounds of the modal:
    ```ts
    interface ExtendedIModalProps extends IModalProps {
      minDragPosition?: ICoordinates;
      maxDragPosition?: ICoordinates;
    }
    ```
    This is to workaround: https://github.com/microsoft/fluentui/issues/20122. Without this the modal can be dragged offscreen.

Once these are resolved `ModalClone.tsx` should be deleted and throughout ouur code we should use Fluent's `<Modal />` component.
