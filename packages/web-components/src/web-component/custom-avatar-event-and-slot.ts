/* eslint-disable max-classes-per-file */
import { attr, css, customElement, FASTElement, html, observable, repeat } from '@microsoft/fast-element';
import { fastButton, provideFASTDesignSystem } from '@microsoft/fast-components';

import { FileSharingCardEventDetail, UserJoinedEventDetail, UserLeftEventDetail } from './event';

provideFASTDesignSystem().register(fastButton());

const userIds = ['apple', 'banana', 'jackfruit', 'mango'];

const template = html<CustomAvatarAndSlot>`
  <fast-button primary @click=${(x) => x.addUser()}> Add User </fast-button>
  <fast-button primary @click=${(x) => x.removeUser()}> Remove User </fast-button>
  <slot name="single-slot"></slot>
  <slot>
    ${repeat(
      (w) => w.users,
      html`
        <div id="user">
          <div id="username">${(u) => u}</div>
          <div id="usericon">
            <slot name="${(u) => `usericon-${u}`}">
              <span>${(u, c) => c.parent.iconDefaultText}</span>
            </slot>
          </div>
        </div>
      `
    )}
  </slot>
  <hr />
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

export interface CustomAvatarAndSlotEventMap {
  userjoined?: UserJoinedEventDetail;
  userleft?: UserLeftEventDetail;
  fileadded?: FileSharingCardEventDetail;
  usersChanged?: UserChangedDetail;
}

export interface CustomAvatarAndSlotProps {
  users?: string[];
  iconDefaultText?: string;
}

@customElement({ name: 'custom-avatar-event-and-slot', template, styles })
export class CustomAvatarAndSlot extends FASTElement implements Required<CustomAvatarAndSlotProps> {
  @observable users: string[] = [];

  // Used in a placeholder when a dynamic icon for a slot is not set.
  // I tried and failed to use a "default slot" for this because we don't know how many
  // default slots we need to fill, and there is no way to slot a single child in a multiple
  // slots.
  // This means that the default behavior API is limited -- Client can't really style it
  // arbitrarily. It is a data-injection API only, not a render injection API.
  @attr iconDefaultText = 'INTERNAL DEFAULT';

  addUser() {
    if (this.users.length === userIds.length) {
      return;
    }
    const userId = userIds[this.users.length];
    this.users = [...this.users, userId];
    this.typedEmit('userjoined', {
      targetSlot: `usericon-${userId}`,
      data: { userId }
    });

    this.typedEmit('usersChanged', {
      users: this.users,
      action: { name: 'joined', targetUser: userId }
    });
  }

  removeUser() {
    if (this.users.length === 0) {
      return;
    }
    const users = [...this.users];
    const [userId] = users.splice(users.length - 1);
    this.users = users;
    this.typedEmit('userleft', { targetSlot: `usericon-${userId}`, user: userId });

    this.typedEmit('usersChanged', {
      users: this.users,
      action: { name: 'left', targetUser: userId }
    });
  }

  private typedEmit<K extends keyof CustomAvatarAndSlotEventMap>(
    type: K,
    detail: CustomAvatarAndSlotEventMap[K]
  ): void {
    this.$emit(type, detail);
  }
}
