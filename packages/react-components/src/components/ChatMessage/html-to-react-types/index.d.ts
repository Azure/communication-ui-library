declare module 'html-to-react' {
  import Parser from './lib/parser';
  import ProcessingInstructions from './lib/processing-instructions';
  import IsValidNodeDefinitions from './lib/is-valid-node-definitions';
  import ProcessNodeDefinitions from './lib/process-node-definitions';

  export { Parser, ProcessingInstructions, IsValidNodeDefinitions, ProcessNodeDefinitions };
}
