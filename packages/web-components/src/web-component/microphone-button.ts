/* eslint-disable max-classes-per-file */
import { attr, css, customElement, FASTElement, html, observable, repeat, when } from '@microsoft/fast-element';
import { fastButton, provideFASTDesignSystem } from '@microsoft/fast-components';
import { ControlBarButtonEventMap, ControlBarButtonProps } from './control-bar-button';

provideFASTDesignSystem().register(fastButton());

const template = html<MicrophoneButton>`
  <control-bar-button
    @click="${(x) => x.toggleMicrophone()}"
    ?disabled="${(x) => x.disabled}"
    ?checked="${(x) => x.checked}"
  >
    <div slot="offIcon"><slot name="micOffIcon">Off</slot></div>
    <div slot="onIcon"><slot name="micOnIcon">On</slot></div>
  </control-bar-button>
`;

export interface MicrophoneButtonEventMap {
  toggleMicrophone?: {};
}

export interface MicrophoneButtonProps extends ControlBarButtonProps {}

@customElement({ name: 'microphone-button', template })
export class MicrophoneButton extends FASTElement implements Required<MicrophoneButtonProps> {
  @attr({ mode: 'boolean' }) disabled = false;
  @attr({ mode: 'boolean' }) checked = false;

  onSlot?: Node[] = undefined;
  offSlot?: Node[] = undefined;

  onSlotChange(slotElement: HTMLSlotElement) {
    const childComponent = this.shadowRoot?.querySelector('control-bar-button');
    if (childComponent) {
      childComponent.innerHTML = '';
    }
    slotElement.assignedElements()?.forEach((element) => {
      childComponent?.appendChild(element);
      this.removeChild(element);
    });
  }

  toggleMicrophone() {
    this.typedEmit('toggleMicrophone', {});
  }

  private typedEmit<K extends keyof MicrophoneButtonEventMap>(type: K, detail: MicrophoneButtonEventMap[K]): void {
    this.$emit(type, detail);
  }
}
