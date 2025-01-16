// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(rtt) */
import { CaptionsInformation, RealTimeTextInformation } from '../CaptionsBanner';
/* @conditional-compile-remove(rtt) */
/**
 * Sorts the captions and real time texts based on their timestamp.
 *
 * @private
 */
export function sortCaptionsAndRealTimeTexts(
  captions: CaptionsInformation[],
  realTimeTexts: RealTimeTextInformation[]
): (CaptionsInformation | RealTimeTextInformation)[] {
  const combinedList = [
    ...(Array.isArray(captions) ? captions.map((caption) => ({ ...caption })) : []),
    ...(realTimeTexts ? realTimeTexts.map((realTimeText) => ({ ...realTimeText })) : [])
  ];

  // Sort the combined list by comparing caption's timestamp with realTimeText's updatedTimestamp
  combinedList.sort((a, b) => {
    const timestampA =
      'captionText' in a
        ? new Date((a as CaptionsInformation).createdTimeStamp ?? 0).getTime()
        : new Date((a as RealTimeTextInformation).finalizedTimeStamp).getTime();
    const timestampB =
      'captionText' in b
        ? new Date((b as CaptionsInformation).createdTimeStamp ?? 0).getTime()
        : new Date((b as RealTimeTextInformation).finalizedTimeStamp).getTime();
    return timestampA - timestampB;
  });

  return combinedList;
}
