export interface StartupInfo {
  version: string
  minerName: string
  plotPaths: number
  postRsVersion: string
  cpu: string
  threadConfig: ThreadConfig
}

interface ThreadConfig {
  nonces: number
  postThreads: number
  randomXThreads: number
}
