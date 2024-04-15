export enum ActiveProofState {
  generatingK2Pow = 'generatingK2Pow',
  readingProofOfSpace = 'readingProofOfSpace',
}

export interface ActiveProof {
  nodeId: string
  startedAt: Date
  state: ActiveProofState
  stateStartedAt: Date
}
