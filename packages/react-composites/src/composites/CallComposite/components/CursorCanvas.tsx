// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack, useTheme } from '@fluentui/react';
import { Cursor20Filled } from '@fluentui/react-icons';
import React, { useEffect, useRef, useState } from 'react';
import { CursorCanvasBubble } from './CursorCanvasBubble';

/**
 * @private
 */
export interface CursorData {
  posX: number;
  posY: number;
  color: string;
  name: string;
  message?: string;
}

/**
 * @private
 */
export interface CursorCanvasProps {
  cursors: CursorData[];
}

/**
 * @private
 */
export const CursorCanvas = (props: CursorCanvasProps): JSX.Element => {
  const palette = useTheme().palette;
  const canvasStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    pointerEvents: 'none', // allow click through canvas (does not work on older browsers)
    background: 'none',
    position: 'relative'
  };

  const containerRef = useRef(null);

  const [currentWidth, setCurrentWidth] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(0);

  const observer = useRef(
    new ResizeObserver((entries): void => {
      const { width, height } = entries[0].contentRect;
      setCurrentWidth(width);
      setCurrentHeight(height);
    })
  );

  useEffect(() => {
    if (containerRef.current) {
      observer.current.observe(containerRef.current);
    }
    const currentObserver = observer.current;
    return () => currentObserver.disconnect();
  }, [observer, containerRef]);

  const cursorElements: JSX.Element[] = props.cursors.map((cursor, i) => {
    // icon itself has a small amount of padding to account for
    const cursorIconOffsetX = 4;
    const cursorIconOffsetY = 3;
    const floatingContainer: React.CSSProperties = {
      position: 'absolute',
      display: 'inline-block',
      left: Math.floor(currentWidth * cursor.posX) - cursorIconOffsetX,
      top: Math.floor(currentHeight * cursor.posY) - cursorIconOffsetY
    };
    const cursorStyle: React.CSSProperties = {
      stroke: `${palette.white}`,
      strokeWidth: '1px'
    };
    const bubbleStyle: React.CSSProperties = {
      paddingLeft: '13px'
    };
    return (
      <div key={i} style={floatingContainer}>
        <Cursor20Filled style={cursorStyle} primaryFill={cursor.color} />
        <Stack style={bubbleStyle}>
          <CursorCanvasBubble
            bubbleOwnerName={cursor.name}
            color={cursor.color}
            onEditingFinished={function (text: string): void {
              throw new Error('Function not implemented.');
            }}
          />
        </Stack>
      </div>
    );
  });

  return (
    <Stack style={canvasStyles}>
      <div className={mergeStyles({ width: '100%', height: '100%' })} ref={containerRef}>
        {cursorElements}
      </div>
    </Stack>
  );
};

/// Code trying out an html5 canvas - absolute positioning seems more than performant though

// const cursorSVGAsPath = new Path2D(
//   'M6.64 2.29A1 1 0 005 3.06v14a1 1 0 001.76.65l3.52-4.07c.28-.33.7-.52 1.13-.52h5.6a1 1 0 00.63-1.77l-11-9.06z'
// );

// /**
//  * @private
//  */
// export const CursorCanvas = (props: CursorCanvasProps): JSX.Element => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const [canvasContext, setCanvasContextRef] = useState<CanvasRenderingContext2D | null>(null);
//   const canvasStyles: React.CSSProperties = {
//     width: '100%',
//     height: '100%',
//     pointerEvents: 'none', // allow click through canvas (does not work on older browsers)
//     background: 'none'
//   };

//   useEffect(() => {
//     if (canvasRef.current) {
//       const canvas = canvasRef.current;
//       setCanvasContextRef(canvas.getContext('2d'));
//     }
//   }, [canvasRef]);

//   useEffect(() => {
//     console.log(props.cursors);
//     if (canvasContext) {
//       canvasContext.strokeStyle = '#fff';
//       canvasContext.lineWidth = 1;
//       props.cursors.forEach((cursor) => {
//         canvasContext.fillStyle = cursor.color;
//         canvasContext.moveTo(cursor.posX, cursor.posY);
//         canvasContext.stroke(cursorSVGAsPath);
//         canvasContext.fill(cursorSVGAsPath);
//       });
//     }
//   }, [canvasContext, props.cursors]);

//   return <canvas ref={canvasRef} style={canvasStyles} />;
// };
