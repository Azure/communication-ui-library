// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationServicesError } from '@azure/communication-calling';

/**
 * Error thrown from failed stateful API methods.
 *
 * @public
 */
export class StatefulError<T> extends Error {
  /**
   * The API method target that failed.
   */
  public target: T;
  /**
   * Error thrown by the failed SDK method.
   */
  public innerError: Error;
  /**
   * Timestamp added to the error by the stateful layer.
   */
  public timestamp: Date;
  /**
   * Primary code for the calling error
   */
  public code?: number;
  /**
   * Sub code for the calling error
   */
  public subCode?: number;

  /** needs to be a (innerError as CommunicationServicesError) */
  constructor(target: T, innerError: Error, name: string, timestamp?: Date) {
    super();
    this.target = target;
    this.innerError = innerError;
    if ('code' in (innerError as CommunicationServicesError)) {
      this.code = (innerError as CommunicationServicesError).code;
    }
    if ('subCode' in (innerError as CommunicationServicesError)) {
      this.subCode = (innerError as CommunicationServicesError).subCode;
    }
    // Testing note: It is easier to mock Date::now() than the Date() constructor.
    this.timestamp = timestamp ?? new Date(Date.now());
    this.name = name;
    this.message = `${this.target}: ${this.innerError.message} code=${this.code} subCode=${this.subCode}`;
  }
}
