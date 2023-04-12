import { createElement } from './utils';

export default function ProcessNodeDefinitions(): {
  processDefaultNode: (node: any, children: any, index: number) => ReturnType<typeof createElement> | boolean;
};
