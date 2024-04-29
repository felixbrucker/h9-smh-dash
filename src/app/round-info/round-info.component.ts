import {Component, Input, OnInit} from '@angular/core'
import {AsyncPipe, NgIf} from '@angular/common'
import dayjs from 'dayjs'
import {PostRoundInfo} from '../../types/post-round-info'
import {relativeTimeExtended} from '../../extensions/relative-time-extended'
import {distinctUntilChanged, map, Observable} from 'rxjs'
import {ScanProgress} from '../../types/scan-progress'

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
export class RoundInfoComponent implements OnInit {
  @Input() public postRoundInfo!: PostRoundInfo
  @Input() public scanProgress$!: Observable<ScanProgress>

  public formattedScanProgress$!: Observable<string>

  public ngOnInit(): void {
    this.formattedScanProgress$ = this.scanProgress$.pipe(
      map(scanProgress => `completed=${scanProgress.completed}, total=${scanProgress.total}`),
      distinctUntilChanged(),
    )
  }

  public getFormattedDate(date: string|Date): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm')
  }

  public getRelativeEta(eta: string|Date): string {
    return dayjs(eta).fromNowExtended()
  }
}
