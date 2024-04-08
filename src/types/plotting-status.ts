export interface PlottingStatus {
  nodeId: string
  path: string
  numUnits: number
  speedInMibPerSec: number
  speedFormatted: string
  currentFile: {
    number: number
    sizeInGib: number
    progress: number
    eta: Date
  }
  totalFiles: {
    number: number
    sizeInGib: number
    progress: number
    eta: Date
  }
}
