import React from 'react';
import { Source } from '@storybook/addon-docs';

type Args = {
  key: string;
  code: string;
  startLine: number;
  endLine: number;
  githubUrl: string;
};

const extractSnippet = (exampleAsText: string, startLine: number, endLine: number) => {
  const exampleAsArr = exampleAsText.split('\n');
  let snippetAsArr = new Array();
  for (var i = startLine - 1; i < endLine; i++) {
    snippetAsArr.push(exampleAsArr[i]);
  }
  return snippetAsArr.join('\n');
};
export const Snippet = (args: Args) => {
  const snippet = extractSnippet(args.code, args.startLine, args.endLine);
  return (
    <div>
      <Source code={snippet} key={args.key} language={'tsx'}></Source>
      See this snippet in a working example in Github <a href={args.githubUrl}>click</a>
    </div>
  );
};
