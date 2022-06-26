import * as React from 'react';
import { wrapElementWithTypedReact } from '../common/utils';
// eslint-disable-next-line import/extensions
import { UserItem, UserItemProps } from '../web-component/user-item';

// Wrap code for current component
export const UserItemReact = wrapElementWithTypedReact<UserItemProps, UserItem, {}>(UserItem, {});
