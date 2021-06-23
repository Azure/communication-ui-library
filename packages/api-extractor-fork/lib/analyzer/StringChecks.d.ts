/**
 * Helpers for validating various text string formats.
 */
export declare class StringChecks {
  /**
   * Tests whether the input string is safe to use as an ECMAScript identifier without quotes.
   *
   * @remarks
   * For example:
   *
   * ```ts
   * class X {
   *   public okay: number = 1;
   *   public "not okay!": number = 2;
   * }
   * ```
   *
   * A precise check is extremely complicated and highly dependent on the ECMAScript standard version
   * and how faithfully the interpreter implements it.  To keep things simple, `isSafeUnquotedMemberIdentifier()`
   * conservatively accepts any identifier that would be valid with ECMAScript 5, and returns false otherwise.
   */
  static isSafeUnquotedMemberIdentifier(identifier: string): boolean;
}
//# sourceMappingURL=StringChecks.d.ts.map
