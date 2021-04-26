import React from 'react';
import { GridLayout, VideoTile } from '@azure/communication-ui';

export const GridLayoutExample = (): JSX.Element => {
  const videoTileStyles = { root: { padding: '10px', border: '1px solid #999' } };
  return (
    <div style={{ height: '530px', width: '830px' }}>
      <GridLayout>
        <VideoTile styles={videoTileStyles} avatarName={'Michael'}>
          <label>Michael</label>
        </VideoTile>
        <VideoTile styles={videoTileStyles} avatarName={'Jim'}>
          <label>Jim</label>
        </VideoTile>
        <VideoTile styles={videoTileStyles} avatarName={'Pam'}>
          <label>Pam</label>
        </VideoTile>
        <VideoTile styles={videoTileStyles} avatarName={'Dwight'}>
          <label>Dwight</label>
        </VideoTile>
      </GridLayout>
    </div>
  );
};
