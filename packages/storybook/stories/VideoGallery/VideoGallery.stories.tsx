// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { VideoGallery as VideoGalleryComponent } from '@azure/communication-react';
import { Image, Stack, Text } from '@fluentui/react';
import { ArgsTable, Canvas, Description, Heading, Source, Subheading, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { yellowBannerPalette } from '../BetaBanners/BannerPalettes';
import { StorybookBanner } from '../BetaBanners/StorybookBanner';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { controlsToAdd, hiddenControl } from '../controlsUtils';
import { CustomAvatarVideoGalleryExample } from './snippets/CustomAvatar.snippet';
import { CustomStyleVideoGalleryExample } from './snippets/CustomStyle.snippet';
import { DefaultVideoGalleryExample } from './snippets/Default.snippet';
import { FloatingLocalVideoExample } from './snippets/FloatingLocalVideo.snippet';
import { FocusedContentExample } from './snippets/FocusedContent.snippet';
import { LocalCameraSwitcherExample } from './snippets/LocalCameraSwitcher.snippet';
import { ManagedPinnedParticipantsExample } from './snippets/ManagedPinnedParticipants.snippet';
import { MobileWrapper } from './snippets/MobileWrapper';
import { OVC3x3VideoGalleryExample } from './snippets/OVC3x3.snippet';
import { PinnedParticipantsDisabledExample } from './snippets/PinnedParticipantsDisabled.snippet';
import { PinnedParticipantsMobileExample } from './snippets/PinnedParticipantsMobile.snippet';
import { ScreenSharingFromPresenterExample } from './snippets/ScreenSharingFromPresenter.snippet';
import { ScreenSharingFromViewerExample } from './snippets/ScreenSharingFromViewer.snippet';
import { SpeakerLayoutExample } from './snippets/SpeakerLayout.snippet';
import { WithHorizontalGalleryExample } from './snippets/WithHorizontalGallery.snippet';
import { WithVerticalGalleryExample } from './snippets/WithVerticalGallery.snippet';
const CustomAvatarVideoGalleryExampleText = require('!!raw-loader!./snippets/CustomAvatar.snippet.tsx').default;
const CustomStyleVideoGalleryExampleText = require('!!raw-loader!./snippets/CustomStyle.snippet.tsx').default;
const DefaultVideoGalleryExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;
const FloatingLocalVideoExampleText = require('!!raw-loader!./snippets/FloatingLocalVideo.snippet.tsx').default;
const focusedContentExampleText = require('!!raw-loader!./snippets/FocusedContent.snippet.tsx').default;
const LocalVideoCameraCycleButtonExampleText =
  require('!!raw-loader!./snippets/LocalCameraSwitcher.snippet.tsx').default;
const ManagedPinnedParticipantsExampleText =
  require('!!raw-loader!./snippets/ManagedPinnedParticipants.snippet.tsx').default;
const OVC3x3ExampleText = require('!!raw-loader!./snippets/OVC3x3.snippet.tsx').default;
const PinnedParticipantsDisabledExampleText =
  require('!!raw-loader!./snippets/PinnedParticipantsDisabled.snippet.tsx').default;
const PinnedParticipantsMobileExampleText =
  require('!!raw-loader!./snippets/PinnedParticipantsMobile.snippet.tsx').default;
const ScreenSharingFromPresenterExampleText =
  require('!!raw-loader!./snippets/ScreenSharingFromPresenter.snippet.tsx').default;
const ScreenSharingFromViewerExampleText =
  require('!!raw-loader!./snippets/ScreenSharingFromViewer.snippet.tsx').default;
const speakerLayoutExampleText = require('!!raw-loader!./snippets/SpeakerLayout.snippet.tsx').default;
const WithHorizontalGalleryExampleText = require('!!raw-loader!./snippets/WithHorizontalGallery.snippet.tsx').default;
const WithVerticalGalleryExampleText = require('!!raw-loader!./snippets/WithVerticalGallery.snippet.tsx').default;

const importStatement = `import { VideoGallery } from '@azure/communication-react';`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>VideoGallery</Title>
      <Description>
        VideoGallery lays out the local user and each remote participant in a call in a
        [VideoTile](./?path=/docs/ui-components-videotile--video-tile) component. The VideoGallery component is made up
        of a [Grid Layout](./?path=/docs/ui-components-videogallery--video-gallery#grid-layout), [Overflow
        Gallery](./?path=/docs/ui-components-videogallery--video-gallery#overflow-gallery), and a [Local Video
        Tile](./?path=/docs/ui-components-videogallery--video-gallery#local-video-tile). The logic used to place each
        [VideoTile](./?path=/docs/ui-components-videotile--video-tile) component into which section is explained below.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Layouts</Heading>
      <Description>
        This feature allows users to choose from a variety of video gallery layouts. On desktop web, the layouts enabled
        include default Gallery, Gallery on Top, Focus Mode, and Speaker Mode. On mobile web, the default gallery and
        large gallery are enabled. This feature will greatly enhance the user experience and provide more flexibility in
        how users view and interact with video content. Enabling this feature will enable greater productivity and allow
        for a better flow of discussions and conversations within calls. Here are some example scenarios where custom
        layouts are useful:
      </Description>
      <ul className={'sbdocs sbdocs-p'}>
        <li>
          During a meeting with many participants such as a conference call, the large gallery layout can be selected to
          have greater visibility of the users in a call.{' '}
        </li>
        <li>
          During a patient/doctor call in which the patient wants to show something, the doctor could enable focus mode
          to hide all other video tiles and focus on the speakers video stream.{' '}
        </li>
        <li>
          In a call with multiple important people that are talking, the speaker mode can be selected which will switch
          the focus between each speaker as they talk.{' '}
        </li>
      </ul>
      <Subheading>Gallery Layout</Subheading>
      <Description>
        If there are no remote video streams on, all participants are placed in the [Grid
        Layout](./?path=/docs/ui-components-gridlayout--grid-layout) including the local user. Otherwise, only remote
        participants with their video streams on are placed in the Grid Layout upto a max of `maxRemoteVideoStreams`.
        The remaining participants are placed in the Horizontal Gallery.
      </Description>
      <Canvas mdxSource={DefaultVideoGalleryExampleText}>
        <DefaultVideoGalleryExample />
      </Canvas>
      <Description>
        Note: The `maxRemoteVideoStreams` prop limits the number of remote video streams in the
        [GridLayout](./?path=/docs/ui-components-gridlayout--grid-layout). If the number of remote participants with
        their video stream on exceeds `maxRemoteVideoStreams` then remote participants in the `dominantSpeakers` prop
        will be prioritized. Furthermore, the VideoGallery is designed to limit the re-ordering when the
        `dominantSpeakers` prop is changed.
      </Description>
      <Subheading>Floating Local Video Layout</Subheading>
      <Description>
        By default, the local video tile is placed in the Grid Layout. But the local video tile can be placed in a
        floating and draggable video tile in the bottom right corner by setting the `layout` prop to
        &apos;floatingLocalVideo&apos;.
      </Description>
      <Canvas mdxSource={FloatingLocalVideoExampleText}>
        <FloatingLocalVideoExample />
      </Canvas>
      <Subheading>Speaker layout</Subheading>
      <Description>
        Speaker Layout is meant to highlight the current dominant speaker in the call. For this view in the video
        gallery the only participant that is in the grid view is the participant talking. All other participants are in
        the overflow gallery. When screen sharing the screenshare will replace this participant and the overflow gallery
        will behave like normal.
      </Description>
      <Canvas mdxSource={speakerLayoutExampleText}>
        <SpeakerLayoutExample />
      </Canvas>
      <Subheading>Focused Content Layout</Subheading>
      <Description>
        This layout is meant to highlight the current screenshare stream. In this view when the screenshare is present
        the other participants will be removed from the grid view and the overflow gallery will be hidden from view.
        This allows for the focus of the local participant to be only on the screenshare stream.
      </Description>
      <Canvas mdxSource={focusedContentExampleText}>
        <FocusedContentExample />
      </Canvas>

      <Heading>Overflow Gallery</Heading>
      <Description>
        In the VideoGallery, when there are participants who are not to be prioritized in the grid view, the
        VideoGallery will enter a new layout called Overflow Layout. When in this mode, the VideoGallery will create a
        sub-gallery that can be placed on the bottom of the VideoGallery displaying participants horizontally by
        assigning the `overflowGalleryPosition` to 'horizontalBottom'. This is the default. Conversely, this sub-gallery
        can be placed on the right displaying participants vertically by assigning the `overflowGalleryPosition` to
        'verticalRight'.
      </Description>
      <Subheading>Horizontal Gallery</Subheading>
      <Description>
        The remote participants not in the Grid Layout are placed in a sub-gallery called the Horizontal Gallery in the
        lower section. A gif element is used to simulate a remote video stream to move the other remote participants to
        the Horizontal Gallery in the example below. This is the default behavior for the VideoGallery, but can also be
        used by setting the `overflowGalleryPosition` property to 'horizontalBottom'.
      </Description>
      <Canvas mdxSource={WithHorizontalGalleryExampleText}>
        <WithHorizontalGalleryExample />
      </Canvas>
      <Subheading>Vertical Gallery</Subheading>
      <Description>
        The remote participants not in the Grid Layout are placed in a sub-gallery called the Vertical Gallery on the
        right side. A gif element is used to simulate a remote video stream to move the other remote participants to the
        Vertical Gallery in the example below. This is used by setting the `overflowGalleryPosition` property to
        'verticalRight'.
      </Description>
      <Canvas mdxSource={WithVerticalGalleryExampleText}>
        <WithVerticalGalleryExample />
      </Canvas>
      <Subheading>Best Practices</Subheading>
      <Description>
        The Overflow Layout is used best in different ways depending on the applications environment. The goal of The
        Overflow Layout is to help manage the vertical space of the applications VideoGallery. If your application runs
        in a window or container that has a narrow aspect ratio, horizontal gallery will be useful for maintaining the
        best aspect ratio of your video tiles in the grid view.
      </Description>
      <Stack horizontalAlign="center" horizontal={true} tokens={{ childrenGap: '0.5rem' }}>
        <Stack horizontalAlign="center">
          <Image
            style={{ width: '100%', height: 'auto' }}
            src="images/narrow-horizontal-gallery.png"
            alt="Fill frame in VideoGallery"
          />
          <Description>✅ Narrow video tile experience with horizontal gallery</Description>
        </Stack>
        <Stack horizontalAlign="center">
          <Image
            style={{ width: '100%', height: 'auto' }}
            src="images/narrow-vertical-gallery.png"
            alt="Fit to frame menu item in VideoGallery"
          />
          <Description>❌ Narrow video tile experience with vertical gallery</Description>
        </Stack>
      </Stack>
      <Stack horizontal={true} tokens={{ childrenGap: '0.5rem' }}>
        <Stack horizontalAlign="center">
          <Image
            style={{ width: '100%', height: 'auto' }}
            src="images/short-gallery.png"
            alt="Fill frame in VideoGallery"
          />
          <Description>❌ Wide video tile experience with horizontal gallery</Description>
        </Stack>
        <Stack horizontalAlign="center">
          <Image
            style={{ width: '100%', height: 'auto' }}
            src="images/short-gallery-vertical.png"
            alt="Fit to frame menu item in VideoGallery"
          />
          <Description>✅ Wide video tile experience with vertical gallery</Description>
        </Stack>
      </Stack>
      <Description>
        The vertical gallery can be most useful when the application is running a very wide environment. Like for
        example a mobile device in landscape. The wide aspect ratio of the device is useful for when a participant is
        watching a screen share on a phone so in this situation the Vertical Gallery can help the stream be more
        visible.
      </Description>
      <Stack horizontal={true} tokens={{ childrenGap: '0.5rem' }}>
        <Stack horizontalAlign="center">
          <Image
            style={{ width: '100%', height: 'auto' }}
            src="images/short-screen-share.png"
            alt="Fill to frame in VideoGallery"
          />
          <Description>❌ Wide screen share appearence horiztonal gallery</Description>
        </Stack>
        <Stack horizontalAlign="center">
          <Image
            style={{ width: '100%', height: 'auto' }}
            src="images/short-screen-share-vertical.png"
            alt="Fill frame menu item in VideoGallery"
          />
          <Description>✅ Wide screen share appearence vertical gallery</Description>
        </Stack>
      </Stack>
      <Heading>Content Sharing Experience</Heading>
      <Description>
        Our VideoGallery component is designed for optimal content sharing, incorporating both screen sharing and
        PowerPoint Live functionalities. The screen shared is the sole element placed in the [Grid
        Layout](./?path=/docs/ui-components-gridlayout--grid-layout), with all remote participants positioned in the
        horizontal gallery at the lower section. For effective screen sharing or PowerPoint Live, ensure the sharing
        participant has their `isScreenSharingOn` prop set to true, along with a defined `screenShareStream` prop (refer
        to `localParticipant` and `remoteParticipants` props).
      </Description>
      <Subheading>Supported Features</Subheading>
      <Description>
        Currently, the VideoGallery component supports two primary features to enhance collaboration and presentation
        quality: screen sharing and PowerPoint Live.
      </Description>
      <ul className={'sbdocs sbdocs-p'}>
        <li>
          <strong>Screen Sharing:</strong> Share your local screen with participants in real-time or view remote screen
          shares. For more details, see the sections below.
        </li>
        <li>
          <strong>PowerPoint Live:</strong> Exclusively view remote PowerPoint presentations.
          <a href="?path=/docs/ppt-live--page">Learn more about PowerPoint Live</a>.
        </li>
      </ul>

      <Subheading>From a presenter point of view</Subheading>
      <Canvas mdxSource={ScreenSharingFromPresenterExampleText}>
        <ScreenSharingFromPresenterExample />
      </Canvas>
      <Subheading>From a viewer point of view</Subheading>
      <Description>
        We have the capability to configure the `screenShareStream` to utilize any `HTMLElement` as the renderElement,
        enabling functionalities like screen sharing and PowerPoint Live. It's important to note that, in this specific
        example, we're replacing the screenshare video stream with an image merely to simulate the experience.
      </Description>
      <Canvas mdxSource={ScreenSharingFromViewerExampleText}>
        <ScreenSharingFromViewerExample />
      </Canvas>
      <Heading>Custom Avatar</Heading>
      <Description>
        Rendering of avatars can be customized through the VideoGallery callback `onRenderAvatar`.
      </Description>
      <Canvas mdxSource={CustomAvatarVideoGalleryExampleText}>
        <CustomAvatarVideoGalleryExample />
      </Canvas>

      <Heading>Custom Style</Heading>
      <Description>
        Style of the VideoGallery container can be customized through its `styles` prop. The `styles` prop is a
        `VideoGalleryStyles` type with subproperties for each part of the VideoGallery as shown in the example below.
      </Description>
      <Canvas mdxSource={CustomStyleVideoGalleryExampleText}>
        <CustomStyleVideoGalleryExample />
      </Canvas>

      <Heading>Local Video Camera Button</Heading>
      <Description>
        The VideoGallery can take in customization to allow for the introduction of local camera controls where the
        button will cycle through the different camera's in the users device. Typical usage is to enable this button on
        mobile devices. This button is enabled through the use of the `showCameraSwitcherInLocalPreview` prop.
      </Description>
      <StorybookBanner palette={yellowBannerPalette}>
        <Text style={{ display: 'inline-block' }}>
          This feature when enabled will disable the ability to drag the local video tile around the video gallery.
        </Text>
      </StorybookBanner>
      <Canvas mdxSource={LocalVideoCameraCycleButtonExampleText}>
        <LocalCameraSwitcherExample />
      </Canvas>

      <Heading>Remote video tile contextual menu</Heading>
      <Description>
        The VideoGallery provides a contextual menu for each remote video tile which can be accessed by hovering the
        remote video tile and clicking menu button next to the participant display name. You can try it out in any of
        the above VideoGallery components on this Docs page. The pin/unpin menu item will be available by default to
        allow pinning participants. To learn more about pinning participants go to the Pinning Participants section
        below. Menu items to change remote video stream rendering options are also available when the `useProps` hook is
        used to provide the props to VideoGallery.
      </Description>
      <Subheading>Disabling remote video tile contextual menu</Subheading>
      <Description>
        Remote video tile contextual menu is be enabled by default but can be disabled by setting the
        `remoteVideoTileMenuOptions` prop to false like in the example below.
      </Description>
      <Canvas mdxSource={PinnedParticipantsDisabledExampleText}>
        <PinnedParticipantsDisabledExample />
      </Canvas>

      <Heading>Pinning Participants</Heading>
      <Description>
        The contextual menu will have a menu item to pin a participant's video tile such that only pinned participants
        are shown in the GridLayout. This is shown in the video clip below. Pinned participants will be shown in the
        order that they are pinned.
      </Description>
      <Image style={{ width: '90%' }} src="images/video-gallery-pinning.gif" alt="VideoGallery pinning" />
      <Description>
        When screensharing is active, pinned participants are placed first in the horizontal gallery as shown in video
        clip below.
      </Description>
      <Image
        style={{ width: '90%' }}
        src="images/video-gallery-pinning-with-screenshare.gif"
        alt="VideoGallery pinning with screenshare active"
      />
      <Description>
        Pinned participants can be unpinned through the contextual menu as shown in the video clip below.
      </Description>
      <Image style={{ width: '90%' }} src="images/video-gallery-unpinning.gif" alt="VideoGallery unpinning" />
      <Description>
        The maximum pinned participants is currently set to 4 for the VideoGallery. The pin menu item will be disabled
        when this limit is reached as shown in the screenshot below.
      </Description>
      <Image
        style={{ width: '90%' }}
        src="images/pinned-limit-reached-video-gallery.png"
        alt="Disabled pin menu item in VideoGallery when limit reached"
      />
      <Subheading>Pinning participants via long touch for mobile</Subheading>
      <Description>
        The VideoGallery also caters to pinning participants on mobile by setting the prop `remoteVideoTileMenuOptions`
        to object `&#123; kind: 'drawer' &#125;`. This changes the contextual menu to a drawer menu that is opened via
        long touch. The result is demonstrated in the example below where all mouse clicks are converted to touch to
        simulate a mobile browser. You can simulate a long touch by long clicking a remote video tile below to see that
        a drawer menu will appear.
      </Description>
      <Canvas mdxSource={PinnedParticipantsMobileExampleText}>
        <MobileWrapper>
          <PinnedParticipantsMobileExample />
        </MobileWrapper>
      </Canvas>
      <Subheading>Managing the pinned participants state</Subheading>
      <Description>
        The state of which remote participants are pinned can be managed by defining the value of the
        `pinnedParticipants` prop. But the callback props `onPinParticipant` and `onUnpinParticipant` must be defined to
        update the managed state. In the example below, the pinned participants state is managed outside of the
        VideoGallery component using a `useState` hook . The display names of the pinned participants are shown in text
        above the VideoGallery.
      </Description>
      <Canvas mdxSource={ManagedPinnedParticipantsExampleText}>
        <ManagedPinnedParticipantsExample />
      </Canvas>

      <Heading>Remote video stream rendering options</Heading>
      <Description>
        When `useProps` hook is used to provide the props to VideoGallery from the [stateful
        client](./?path=/docs/statefulclient-overview--page), prop `remoteParticipants` will contain information on the
        video streams of each remote participant and props `onCreateRemoteStreamView` and `onDisposeRemoteStreamView`
        handle the creation and disposal of these video streams. The VideoGallery component will have a menu item in the
        contextual menu of remote video tiles to change the rendering option of active remote video streams to either
        fill-frame or fit-to-frame. Below are screenshots to demonstrate this feature.
      </Description>
      <Stack horizontal={true} tokens={{ childrenGap: '0.5rem' }}>
        <Stack horizontalAlign="center">
          <Image
            style={{ width: '100%', height: 'auto' }}
            src="images/fill-frame-video-gallery.png"
            alt="Fill frame in VideoGallery"
          />
          <Description>Remote video stream rendered to fill frame</Description>
        </Stack>
        <Stack horizontalAlign="center">
          <Image
            style={{ width: '100%', height: 'auto' }}
            src="images/fit-to-frame-menu-item-video-gallery.png"
            alt="Fit to frame menu item in VideoGallery"
          />
          <Description>Option to change rendering to fit-to-frame</Description>
        </Stack>
      </Stack>
      <Stack horizontal={true} tokens={{ childrenGap: '0.5rem' }}>
        <Stack horizontalAlign="center">
          <Image
            style={{ width: '100%', height: 'auto' }}
            src="images/fit-to-frame-video-gallery.png"
            alt="Fill to frame in VideoGallery"
          />
          <Description>Remote video stream rendered to fit-to-frame</Description>
        </Stack>
        <Stack horizontalAlign="center">
          <Image
            style={{ width: '100%', height: 'auto' }}
            src="images/fill-frame-menu-item-video-gallery.png"
            alt="Fill frame menu item in VideoGallery"
          />
          <Description>Option to change rendering to fill frame</Description>
        </Stack>
      </Stack>
      <Subheading>Assigning the default rendering options</Subheading>
      <Description>
        The default rendering options can be set for remote video streams as well as the local video stream through
        VideoGallery props `remoteVideoViewOptions` and `localVideoViewOptions`. To set the remote video streams to fill
        frame set the scalingMode to 'Crop' like in the code snippet. To set it to fit-to-frame set scalingMode to
        'Fit'.
      </Description>
      <Source code={renderingOptionsDefault} />

      <Heading>Local video tile aspect ratio options</Heading>
      <Description>
        The local video tile can have its aspect ratio controlled to ensure the expected behavior for the device
        formfactor and orientation. If left unset it will follow the default of `followDeviceOrientation` which will
        have the tile follow the responsive behaviors that the gallery laredy provides.
      </Description>
      <Stack horizontal horizontalAlign="space-between" tokens={{ childrenGap: '1rem' }}>
        <Stack horizontalAlign="center">
          <img
            style={{ width: '100%', maxWidth: '25rem' }}
            src="images/storybook-gallery-169.png"
            alt="Grid layout for composite video gallery"
          />
          <Description>Local tile size `16:9` aspect ratio.</Description>
        </Stack>
        <Stack horizontalAlign="center">
          <img
            style={{ width: '100%', maxWidth: '25rem' }}
            src="images/storybook-gallery-916.png"
            alt="Floating layout for composite video gallery"
          />
          <Description>Local tile size `9:16` aspect ratio.</Description>
        </Stack>
        <Stack horizontalAlign="center">
          <img
            style={{ width: '100%', maxWidth: '25rem' }}
            src="images/storybook-gallery-hidden.png"
            alt="Floating layout for composite video gallery"
          />
          <Description>Local tile size `hidden` removes the local tile</Description>
        </Stack>
      </Stack>

      <Heading>Optimal Video Count and 3x3 Video Tiles</Heading>
      <Description>
        The Optimal Video Count (OVC) feature provides a way to make sure that the number of videos rendered within the
        gallery is appropiate and that all videos are rendering in the best quality possible. This feature is used in
        the implementation of the VideoGallery as a default behavior for maxRemoteVideoRenderers property currently
        exposed, changing the previous default which was static to a dynamic one that it is coming from SDK layer. This
        Optimal Video Count value could increase or decrease during the call according to the network conditions in
        conjuction with the memory usage by the participant currently rendering videos. To read more about OVC, video
        quality and how it works within the sdk, [Click
        Here](https://learn.microsoft.com/en-us/azure/communication-services/how-tos/calling-sdk/manage-video?pivots=platform-web)
      </Description>
      <Subheading>3x3 Video Gallery Layout</Subheading>
      <Description>
        The 3x3 video gallery allows customers to have 9 remote videos rendering with the highest optimal quality.
      </Description>
      <Canvas mdxSource={OVC3x3ExampleText}>
        <OVC3x3VideoGalleryExample />
      </Canvas>

      <Heading>Props</Heading>
      <ArgsTable of={VideoGalleryComponent} />
    </>
  );
};

const renderingOptionsDefault = `
import { VideoGallery, VideoStreamOptions } from '@internal/react-components';

const ViewOptionsDefault = (): JSX.Element => {
  const localVideoViewOptions = {
    scalingMode: 'Crop',
    isMirrored: true
  } as VideoStreamOptions;

  const remoteVideoViewOptions = {
    scalingMode: 'Crop',
    isMirrored: true
  } as VideoStreamOptions;

  return (
    <VideoGallery
      layout="floatingLocalVideo"
      localParticipant={MockLocalParticipant}
      remoteParticipants={MockRemoteParticipants}
      localVideoViewOptions={localVideoViewOptions}
      remoteVideoViewOptions={remoteVideoViewOptions}
    />
  );
};
}
`;

const MockLocalParticipant = {
  userId: 'userLocal',
  displayName: 'You',
  state: 'Connected',
  isMuted: true,
  isScreenSharingOn: false
};

const VideoGalleryStory = (args): JSX.Element => {
  const remoteParticipants = args.remoteParticipants
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p)
    .map((p) => {
      return {
        userId: `userId-${p}`,
        displayName: p,
        videoStream: { isAvailable: true }
      };
    });

  const localParticipant = MockLocalParticipant;
  localParticipant.isScreenSharingOn = args.screenShareExperience === 'presenter';

  if (remoteParticipants.length > 0) {
    remoteParticipants[0].isScreenSharingOn = args.screenShareExperience === 'viewer';

    if (args.screenShareExperience === 'viewer') {
      const mockVideoElement = document.createElement('div');
      mockVideoElement.style.width = '100%';
      mockVideoElement.style.height = '100%';
      mockVideoElement.style.textAlign = 'center';
      const imageElement = document.createElement('img');
      imageElement.src = 'images/screenshare-example.png';
      imageElement.style.maxWidth = decodeURIComponent('100%25');
      imageElement.style.maxHeight = decodeURIComponent('100%25');
      mockVideoElement.appendChild(imageElement);
      const mockScreenShareStream = {
        isAvailable: true,
        renderElement: mockVideoElement as HTMLElement
      };
      remoteParticipants[0].screenShareStream = mockScreenShareStream;
    }
  }

  return (
    <VideoGalleryComponent
      layout={args.videoGalleryLayout}
      overflowGalleryPosition={args.overflowGalleryPosition}
      localParticipant={MockLocalParticipant}
      remoteParticipants={remoteParticipants}
      localVideoTileSize={args.localVideoTileSize}
    />
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const VideoGallery = VideoGalleryStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-videogallery`,
  title: `${COMPONENT_FOLDER_PREFIX}/Video Gallery`,
  component: VideoGalleryComponent,
  argTypes: {
    remoteParticipants: controlsToAdd.remoteParticipantNames,
    videoGalleryLayout: controlsToAdd.videoGallerylayout,
    overflowGalleryPosition: controlsToAdd.overflowGalleryPosition,
    localVideoTileSize: controlsToAdd.localVideoTileSize,
    screenShareExperience: controlsToAdd.screenShareExperience,
    // Hiding auto-generated controls
    styles: hiddenControl,
    localParticipant: hiddenControl,
    localVideoViewOptions: hiddenControl,
    remoteVideoViewOption: hiddenControl,
    onCreateLocalStreamView: hiddenControl,
    onDisposeLocalStreamView: hiddenControl,
    onRenderLocalVideoTile: hiddenControl,
    onCreateRemoteStreamView: hiddenControl,
    onRenderRemoteVideoTile: hiddenControl,
    onDisposeRemoteStreamView: hiddenControl,
    onRenderAvatar: hiddenControl,
    showMuteIndicator: hiddenControl,
    dominantSpeakers: hiddenControl,
    strings: hiddenControl,
    maxRemoteVideoStreams: hiddenControl,
    pinnedParticipants: hiddenControl,
    onPinParticipant: hiddenControl,
    onUnpinParticipant: hiddenControl,
    layout: hiddenControl,
    onDisposeRemoteVideoStreamView: hiddenControl,
    onDisposeRemoteScreenShareStreamView: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
