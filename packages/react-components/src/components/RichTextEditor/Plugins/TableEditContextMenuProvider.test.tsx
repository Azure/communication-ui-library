// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// import { isTableEditable } from "./TableEditContextMenuProvider";
// import { Editor, createModelFromHtml } from 'roosterjs-content-model-core';

// describe('isTableEditable', () => {
//   test('should return true when table is content editable', () => {
//     const fragment = document.createDocumentFragment();
//     const container = fragment.appendChild(document.createElement('div'));
//     const initialModel = createModelFromHtml('<table><tr><td contenteditable><div id="testNode">test</div></td></tr></table>');
//     const editor = new Editor(container,
//       {
//         initialModel: initialModel
//       }
//     )

//     // Get the test node the check if it is content editable
//     const testNode = document.getElementById('testNode');
//     if (!testNode) {
//       throw new Error('Test node is not found');
//     }
//     const result = isTableEditable(editor, testNode);

//     expect(result).toBe(true);
//   });
// });
