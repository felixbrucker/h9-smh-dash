export enum ActiveInitProofState {
  generatingK2Pow = 'generatingK2Pow',
  readingProofOfSpace = 'readingProofOfSpace',
}

export interface ActiveInitProof {
  nodeId: string
  startedAt: Date
  state: ActiveInitProofState
  stateStartedAt: Date
}
