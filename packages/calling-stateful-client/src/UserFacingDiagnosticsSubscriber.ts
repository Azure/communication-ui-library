// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  UserFacingDiagnosticsFeature,
  DiagnosticChangedEventArgs,
  LatestDiagnosticValue,
  MediaDiagnosticChangedEventArgs,
  NetworkDiagnosticChangedEventArgs
} from '@azure/communication-calling';
/* @conditional-compile-remove(remote-ufd) */
import { RemoteParticipantDiagnosticsData } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';

/**
 * @private
 */
export class UserFacingDiagnosticsSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _diagnostics: UserFacingDiagnosticsFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, diagnostics: UserFacingDiagnosticsFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._diagnostics = diagnostics;

    this.setInitialDiagnostics();
    this.subscribe();
  }

  public unsubscribe = (): void => {
    this._diagnostics.network.off('diagnosticChanged', this.networkDiagnosticsChanged.bind(this));
    this._diagnostics.media.off('diagnosticChanged', this.mediaDiagnosticsChanged.bind(this));
  };

  private setInitialDiagnostics(): void {
    const network = this._diagnostics.network.getLatest();
    const media = this._diagnostics.media.getLatest();
    if (Object.entries(network).length === 0 && Object.entries(media).length === 0) {
      return;
    }

    this._context.modifyState((state) => {
      const call = state.calls[this._callIdRef.callId];
      if (call === undefined) {
        return;
      }
      call.diagnostics = {
        network: {
          latest: network
        },
        media: {
          latest: media
        }
      };
    });
  }

  private subscribe(): void {
    this._diagnostics.network.on('diagnosticChanged', this.networkDiagnosticsChanged.bind(this));
    this._diagnostics.media.on('diagnosticChanged', this.mediaDiagnosticsChanged.bind(this));
    /* @conditional-compile-remove(remote-ufd) */
    this._diagnostics.remote.on('diagnosticChanged', this.remoteDiagnosticsChanged.bind(this));
  }
  /* @conditional-compile-remove(remote-ufd) */
  private remoteDiagnosticsChanged(args: RemoteParticipantDiagnosticsData): void {
    this._context.modifyState((state) => {
      const call = state.calls[this._callIdRef.callId];
      if (call === undefined) {
        return;
      }
      for (const diagnostic of args.diagnostics) {
        const { remoteParticipant: _, rawId, ...participantDiagnostic } = diagnostic;
        const participant = call.remoteParticipants[rawId];
        if (participant) {
          participant.diagnostics = participant.diagnostics || {};
          participant.diagnostics[participantDiagnostic.diagnostic] = participantDiagnostic;
        }
      }
    });
  }

  private networkDiagnosticsChanged(args: NetworkDiagnosticChangedEventArgs): void {
    this._context.modifyState((state) => {
      const call = state.calls[this._callIdRef.callId];
      if (call === undefined) {
        return;
      }
      const network = call.diagnostics?.network.latest;
      if (network) {
        network[args.diagnostic] = latestFromEvent(args);
      }
    });
  }

  private mediaDiagnosticsChanged(args: MediaDiagnosticChangedEventArgs): void {
    this._context.modifyState((state) => {
      const call = state.calls[this._callIdRef.callId];
      if (call === undefined) {
        return;
      }
      const media = call.diagnostics?.media.latest;
      if (media) {
        media[args.diagnostic] = latestFromEvent(args);
      }
    });
  }
}

const latestFromEvent = (args: DiagnosticChangedEventArgs): LatestDiagnosticValue => ({
  value: args.value,
  valueType: args.valueType
});
