/* eslint-disable max-classes-per-file */
import { attr, css, customElement, FASTElement, html, observable, repeat, when } from '@microsoft/fast-element';
import { fastButton, provideFASTDesignSystem } from '@microsoft/fast-components';

provideFASTDesignSystem().register(fastButton());

const template = html<ControlBarButton>`
  <fast-button primary>
    ${when((x) => x.checked === false, html`<slot name="offIcon"></slot>`)}
    ${when((x) => x.checked === true, html`<slot name="onIcon"></slot>`)}
  </fast-button>
`;

const styles = css`
  #user {
    border-width: 1px;
    border-color: black;
    border-style: solid;
    padding: 1rem;
    margin: 1rem;
  }
  #username,
  #usericon {
    display: inline-block;
    padding: 1px;
  }
`;

export interface UserChangedDetail {
  users: string[];
  action: {
    name: 'joined' | 'left';
    targetUser: string;
  };
}

export interface ControlBarButtonEventMap {
  click?: {};
}

export interface ControlBarButtonProps {
  disabled?: boolean;
  checked?: boolean;
}

@customElement({ name: 'control-bar-button', template, styles })
export class ControlBarButton extends FASTElement implements Required<ControlBarButtonProps> {
  @attr({ mode: 'boolean' }) disabled = false;
  @attr({ mode: 'boolean' }) checked = false;

  // onClick() {
  //   this.typedEmit('click', {});
  // }

  private typedEmit<K extends keyof ControlBarButtonEventMap>(type: K, detail: ControlBarButtonEventMap[K]): void {
    this.$emit(type, detail);
  }
}
