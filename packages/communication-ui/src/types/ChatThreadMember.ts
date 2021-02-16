// © Microsoft Corporation. All rights reserved.

/**
 * If displayName is undefined, the ChatThreadMember will not be listed in the ParticipantManagement component. I think
 * the original idea was a way to hide the moderator user. We may want to change this in the future.
 */
export type ChatThreadMember = {
  userId: string;
  displayName?: string;
};
