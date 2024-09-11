// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _pxToRem } from '@internal/acs-ui-common';
import React, { useLayoutEffect, useRef, useState } from 'react';

/**
 * An SVG element component that wraps inner text to fit the width of the SVG.
 * @private
 */
export const SvgWithWordWrapping = (props: {
  width: number;
  text: string;
  lineHeightPx: number;
  bufferHeightPx: number;
  role?: string;
}): JSX.Element => {
  const { width, text, lineHeightPx, bufferHeightPx, role } = props;
  const svgRef = useRef<SVGSVGElement>(null);
  const calculationTextElement = useRef<SVGTextElement>(null);
  const visibleTextElement = useRef<SVGTextElement>(null);
  const [height, setHeight] = useState<number>(0);

  // useLayoutEffect ensures that the calculationTextElement is rendered before being used for calculations.
  // Using useLayoutEffect over useEffect ensures we do not get a layout shift when the visibleTextElement is rendered
  // and the height is updated. This is because useLayoutEffect runs synchronously after DOM mutations but
  // before the browser has a chance to paint. See https://reactjs.org/docs/hooks-reference.html#uselayouteffect
  // for more details.
  useLayoutEffect(() => {
    if (text && calculationTextElement.current && visibleTextElement.current) {
      const numLines = convertTextToWrappedText(
        calculationTextElement.current,
        visibleTextElement.current,
        width,
        lineHeightPx
      );
      setHeight(numLines * lineHeightPx);
    }
  }, [width, lineHeightPx, text]);

  return (
    <svg role={role} width={width} height={height + bufferHeightPx} ref={svgRef} xmlns="http://www.w3.org/2000/svg">
      <text height={0} ref={calculationTextElement} style={{ visibility: 'hidden' }}>
        {text}
      </text>
      <text ref={visibleTextElement} x="0" y={bufferHeightPx / 4} role="heading" aria-level={1} />
    </svg>
  );
};

/**
 * Wrap text in tspan elements to fit the width of the SVG
 * @param baseTextElement The text element to create the wrapped text from.
 * @param outputTextElement The text element to insert the wrapped text into.
 * @param maxWidth The maximum width of the text element.
 * @param lineHeightPx The height of each line in pixels.
 * @returns The number of lines of text.
 */
const convertTextToWrappedText = (
  inputTextElement: SVGTextElement,
  outputTextElement: SVGTextElement,
  maxWidth: number,
  lineHeightPx: number
): number => {
  const words = inputTextElement.textContent?.split(' ') ?? [];
  if (words.length === 0 || words[0] === '') {
    throw new Error('Text element must contain text');
  }

  // The current line being built.
  let line = '';

  // Running total of the number of lines.
  let numLines = 0;

  // First, clear the output text element.
  outputTextElement.textContent = '';

  // Iterate through each word and create a tspan element for each line.
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const testWidth = inputTextElement.getSubStringLength(0, testLine.length);

    if (testWidth > maxWidth && i > 0) {
      const newLine = constructTSpanLine(line, lineHeightPx);
      outputTextElement.appendChild(newLine);
      line = words[i] + ' ';
      numLines++;
    } else {
      line = testLine;
    }
  }

  // Add the last line.
  const newLine = constructTSpanLine(line, lineHeightPx);
  outputTextElement.appendChild(newLine);
  numLines++;

  // Return the number of lines to calculate the height of the SVG.
  return numLines;
};

/**
 * Create a tspan element for a line of text, with text set to be centered.
 * @param line The line of text.
 * @param lineHeightPx The height of each line in pixels.
 * @returns The tspan element.
 */
const constructTSpanLine = (line: string, lineHeightPx: number): SVGTSpanElement => {
  const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
  tspan.textContent = line;
  tspan.setAttribute('x', '50%');
  tspan.setAttribute('dy', `${lineHeightPx}px`);
  tspan.setAttribute('text-anchor', 'middle');
  return tspan;
};
