import { GridLayout, VideoTile } from '@azure/communication-react';
import React from 'react';

export const GridLayoutExample = (): JSX.Element => {
  const videoTileStyles = { root: { padding: '10px', border: '1px solid #999' } };
  return (
    <div style={{ height: '530px', width: '830px' }}>
      <GridLayout>
        <VideoTile styles={videoTileStyles} displayName={'Michael'} />
        <VideoTile styles={videoTileStyles} displayName={'Jim'} />
        <VideoTile styles={videoTileStyles} displayName={'Pam'} />
        <VideoTile styles={videoTileStyles} displayName={'Dwight'} />
      </GridLayout>
    </div>
  );
};
