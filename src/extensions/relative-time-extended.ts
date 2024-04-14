import {PluginFunc} from 'dayjs'
import duration, {Duration} from 'dayjs/plugin/duration'

declare module 'dayjs' {
  interface Dayjs {
    fromNowExtended(): string
    toNowExtended(): string
  }
}

export const relativeTimeExtended: PluginFunc = (_, Dayjs, dayjs) => {
  dayjs.extend(duration)

  function formatDuration(duration: Duration): string {
    const spacedParts: string[] = []
    if (duration.years() > 0) {
      spacedParts.push(`${duration.years()}y`)
    }
    if (duration.months() > 0) {
      spacedParts.push(`${duration.months()}m`)
    }
    if (duration.days() > 0) {
      spacedParts.push(`${duration.days()}d`)
    }
    if (duration.hours() > 0) {
      spacedParts.push(`${duration.hours()}h`)
    }
    spacedParts.push(`${duration.minutes()}m`)

    return spacedParts.join(' ')
  }

  Dayjs.prototype.toNowExtended = function (): string {
    return formatDuration(dayjs.duration(dayjs().diff(this, 'milliseconds'), 'milliseconds'))
  }

  Dayjs.prototype.fromNowExtended = function (): string {
    return formatDuration(dayjs.duration(this.diff(dayjs(), 'milliseconds'), 'milliseconds'))
  }
}
