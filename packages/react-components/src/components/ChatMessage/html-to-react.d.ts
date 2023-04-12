declare module 'html-to-react' {
  import { ParserOptions } from 'htmlparser2';
  import { ReactElement } from 'react';

  function Html2ReactParser(options: ParserOptions): {
    parse: (html: string) => ReactNode | ReactNode[];
    parseWithInstructions: (
      html: string,
      isValidNode: (node: ReactNode) => boolean,
      processingInstructions?: ProcessingInstructionType[],
      preprocessingInstructions?: ProcessingInstructionType[]
    ) => ReactNode | ReactNode[];
  };

  function createElement(node: ReactNode, index: number, data: any, children: ReactNode[]): ReactNode;

  type ProcessingInstructionType = {
    shouldProcessNode: (node: ReactNode) => boolean;
    processNode: (node: ReactNode, children: ReactNode[], index: number) => ReactNode | ReactNode[];
  };
  function ProcessingInstructions(): {
    defaultProcessingInstructions: ProcessingInstructionType[];
  };

  function ProcessNodeDefinitions(): {
    processDefaultNode: (node: ReactNode, children: ReactNode[], index: number) => ReactNode | ReactNode[];
  };

  const IsValidNodeDefinitions: {
    alwaysValid(): boolean;
  };

  export { Html2ReactParser as Parser, ProcessingInstructions, IsValidNodeDefinitions, ProcessNodeDefinitions };
}
