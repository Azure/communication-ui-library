// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack, useTheme } from '@fluentui/react';
import { Cursor20Filled } from '@fluentui/react-icons';
import React from 'react';

/**
 * @private
 */
export interface CursorData {
  posX: number;
  posY: number;
  color: string;
  userId?: string;
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

  const cursorElements: JSX.Element[] = props.cursors.map((cursor, i) => {
    // icon itself has a small amount of padding to account for
    const cursorIconOffsetX = 4;
    const cursorIconOffsetY = 3;

    const cursorStyle: React.CSSProperties = {
      position: 'absolute',
      left: cursor.posX - cursorIconOffsetX,
      top: cursor.posY - cursorIconOffsetY,
      stroke: `${palette.white}`,
      strokeWidth: '2px'
    };
    return <Cursor20Filled key={i} style={cursorStyle} primaryFill={cursor.color} />;
  });

  return <Stack style={canvasStyles}>{cursorElements}</Stack>;
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
