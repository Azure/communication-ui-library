/* eslint-disable max-classes-per-file */
import { attr, css, customElement, FASTElement, html } from '@microsoft/fast-element';

const template = html<UserItem>`
  <div id="user">
    <div id="username">${(x) => x.user}</div>
    <div id="usericon">
      <slot> </slot>
    </div>
  </div>
`;

export interface UserItemProps {
  user: string;
}

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

@customElement({ name: 'user-item', template, styles })
export class UserItem extends FASTElement implements Required<UserItemProps> {
  @attr user = '';
}
