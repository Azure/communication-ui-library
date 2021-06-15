import * as ts from 'typescript';
import { StringBuilder } from '@microsoft/tsdoc';
/**
 * Specifies various transformations that will be performed by Span.getModifiedText().
 */
export declare class SpanModification {
  /**
   * If true, all of the child spans will be omitted from the Span.getModifiedText() output.
   * @remarks
   * Also, the modify() operation will not recurse into these spans.
   */
  omitChildren: boolean;
  /**
   * If true, then the Span.separator will be removed from the Span.getModifiedText() output.
   */
  omitSeparatorAfter: boolean;
  /**
   * If true, then Span.getModifiedText() will sort the immediate children according to their Span.sortKey
   * property.  The separators will also be fixed up to ensure correct indentation.  If the Span.sortKey is undefined
   * for some items, those items will not be moved, i.e. their array indexes will be unchanged.
   */
  sortChildren: boolean;
  /**
   * Used if the parent span has Span.sortChildren=true.
   */
  sortKey: string | undefined;
  private readonly _span;
  private _prefix;
  private _suffix;
  constructor(span: Span);
  /**
   * Allows the Span.prefix text to be changed.
   */
  get prefix(): string;
  set prefix(value: string);
  /**
   * Allows the Span.suffix text to be changed.
   */
  get suffix(): string;
  set suffix(value: string);
  /**
   * Reverts any modifications made to this object.
   */
  reset(): void;
  /**
   * Effectively deletes the Span from the tree, by skipping its children, skipping its separator,
   * and setting its prefix/suffix to the empty string.
   */
  skipAll(): void;
}
/**
 * The Span class provides a simple way to rewrite TypeScript source files
 * based on simple syntax transformations, i.e. without having to process deeper aspects
 * of the underlying grammar.  An example transformation might be deleting JSDoc comments
 * from a source file.
 *
 * @remarks
 * TypeScript's abstract syntax tree (AST) is represented using Node objects.
 * The Node text ignores its surrounding whitespace, and does not have an ordering guarantee.
 * For example, a JSDocComment node can be a child of a FunctionDeclaration node, even though
 * the actual comment precedes the function in the input stream.
 *
 * The Span class is a wrapper for a single Node, that provides access to every character
 * in the input stream, such that Span.getText() will exactly reproduce the corresponding
 * full Node.getText() output.
 *
 * A Span is comprised of these parts, which appear in sequential order:
 * - A prefix
 * - A collection of child spans
 * - A suffix
 * - A separator (e.g. whitespace between this span and the next item in the tree)
 *
 * These parts can be modified via Span.modification.  The modification is applied by
 * calling Span.getModifiedText().
 */
export declare class Span {
  readonly node: ts.Node;
  readonly startIndex: number;
  readonly endIndex: number;
  readonly children: Span[];
  readonly modification: SpanModification;
  private _parent;
  private _previousSibling;
  private _nextSibling;
  private _separatorStartIndex;
  private _separatorEndIndex;
  constructor(node: ts.Node);
  get kind(): ts.SyntaxKind;
  /**
   * The parent Span, if any.
   * NOTE: This will be undefined for a root Span, even though the corresponding Node
   * may have a parent in the AST.
   */
  get parent(): Span | undefined;
  /**
   * If the current object is this.parent.children[i], then previousSibling corresponds
   * to this.parent.children[i-1] if it exists.
   * NOTE: This will be undefined for a root Span, even though the corresponding Node
   * may have a previous sibling in the AST.
   */
  get previousSibling(): Span | undefined;
  /**
   * If the current object is this.parent.children[i], then previousSibling corresponds
   * to this.parent.children[i+1] if it exists.
   * NOTE: This will be undefined for a root Span, even though the corresponding Node
   * may have a previous sibling in the AST.
   */
  get nextSibling(): Span | undefined;
  /**
   * The text associated with the underlying Node, up to its first child.
   */
  get prefix(): string;
  /**
   * The text associated with the underlying Node, after its last child.
   * If there are no children, this is always an empty string.
   */
  get suffix(): string;
  /**
   * Whitespace that appeared after this node, and before the "next" node in the tree.
   * Here we mean "next" according to an inorder traversal, not necessarily a sibling.
   */
  get separator(): string;
  /**
   * Returns the separator of this Span, or else recursively calls getLastInnerSeparator()
   * on the last child.
   */
  getLastInnerSeparator(): string;
  /**
   * Returns the first parent node with the specified  SyntaxKind, or undefined if there is no match.
   */
  findFirstParent(kindToMatch: ts.SyntaxKind): Span | undefined;
  /**
   * Starting from the first character of this span, walk backwards until we find the start of the line,
   * and return whitespace after that position.
   *
   * @remarks
   * For example, suppose the character buffer contains this text:
   * ```
   *              1111111111222222
   *  012345 6 7890123456789012345
   * "line 1\r\n  line 2 Example"
   * ```
   *
   * And suppose the span starts at index 17, i.e. the the "E" in example.  The `getIndent()` method would return
   * two spaces corresponding to the range from index 8 through and including index 9.
   */
  getIndent(): string;
  /**
   * Recursively invokes the callback on this Span and all its children.  The callback
   * can make changes to Span.modification for each node.
   */
  forEach(callback: (span: Span) => void): void;
  /**
   * Returns the original unmodified text represented by this Span.
   */
  getText(): string;
  /**
   * Returns the text represented by this Span, after applying all requested modifications.
   */
  getModifiedText(): string;
  writeModifiedText(output: StringBuilder): void;
  /**
   * Returns a diagnostic dump of the tree, showing the prefix/suffix/separator for
   * each node.
   */
  getDump(indent?: string): string;
  private _writeModifiedText;
  private _getTrimmed;
  private _getSubstring;
}
//# sourceMappingURL=Span.d.ts.map
