import { shouldProcessEveryNode } from './should-process-node-definitions';
import { processDefaultNode } from './process-node-definitions';

export default function ProcessingInstructions(): {
  defaultProcessingInstructions: {
    shouldProcessNode: typeof shouldProcessEveryNode;
    processNode: typeof processDefaultNode;
  }[];
};
