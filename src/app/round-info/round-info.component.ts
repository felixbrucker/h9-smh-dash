import {Component, Input} from '@angular/core'
import {AsyncPipe, NgIf} from '@angular/common'
import dayjs from 'dayjs'
import {PostRoundInfo} from '../../types/post-round-info'
import {relativeTimeExtended} from '../../extensions/relative-time-extended'

dayjs.extend(relativeTimeExtended)

@Component({
  selector: 'app-round-info',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './round-info.component.html',
  styleUrl: './round-info.component.scss'
})
export class RoundInfoComponent {
  @Input() public postRoundInfo!: PostRoundInfo

  public getFormattedDate(date: string|Date): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm')
  }

  public getRelativeEta(eta: string|Date): string {
    return dayjs(eta).fromNowExtended()
  }
}
