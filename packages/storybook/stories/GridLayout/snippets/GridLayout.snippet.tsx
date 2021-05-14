import { GridLayout, VideoTile } from '@azure/communication-react';
import React from 'react';

export const GridLayoutExample = (): JSX.Element => {
  const videoTileStyles = { root: { padding: '10px', border: '1px solid #999' } };
  return (
    <div style={{ height: '530px', width: '830px' }}>
      <GridLayout>
        <VideoTile styles={videoTileStyles} displayName={'Michael'}>
          <label>Michael</label>
        </VideoTile>
        <VideoTile styles={videoTileStyles} displayName={'Jim'}>
          <label>Jim</label>
        </VideoTile>
        <VideoTile styles={videoTileStyles} displayName={'Pam'}>
          <label>Pam</label>
        </VideoTile>
        <VideoTile styles={videoTileStyles} displayName={'Dwight'}>
          <label>Dwight</label>
        </VideoTile>
      </GridLayout>
    </div>
  );
};
