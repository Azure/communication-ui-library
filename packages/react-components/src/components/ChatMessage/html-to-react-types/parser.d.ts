import { ProcessingInstructions } from './processing-instructions';
import { ParserOptions } from 'htmlparser2';
import { createElement } from './utils';

export interface Options {
  decodeEntities: boolean;
}

declare class Html2ReactParser {
  constructor(options?: ParserOptions);
  parse: (html: string) => ReactElement;
  parseWithInstructions: (
    html: string,
    isValidNode: boolean,
    processingInstructions?: ProcessingInstructions,
    preprocessingInstructions?: ProcessingInstructions
  ) => ReturnType<typeof createElement>[];
}

export default Html2ReactParser;
