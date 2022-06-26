import * as React from 'react';
import { CustomAvatarAndSlotReact, CustomSingleSlot } from './CustomAvatarAndSlotReact';
// eslint-disable-next-line import/extensions

export type CustomAvatarOnRenderStyleProps = React.ComponentPropsWithoutRef<typeof CustomAvatarAndSlotReact> & {
  onRenderUser?: (e: string) => JSX.Element;
  onRenderSingleSlot?: () => JSX.Element;
};

export const CustomAvatarOnRenderStyle = (props: CustomAvatarOnRenderStyleProps) => {
  const [userDetails, setUserDetails] = React.useState<string[]>([]);
  return (
    <CustomAvatarAndSlotReact onUsersChanged={(e) => setUserDetails(e.detail.users)}>
      <CustomSingleSlot>{props.onRenderSingleSlot && props.onRenderSingleSlot()}</CustomSingleSlot>
      {props.onRenderUser && userDetails.map(props.onRenderUser)}
    </CustomAvatarAndSlotReact>
  );
};
