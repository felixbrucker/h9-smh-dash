import {Component, Input} from '@angular/core'
import {AsyncPipe, NgForOf} from '@angular/common'
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card'
import {MatProgressBar} from '@angular/material/progress-bar'
import {MatTooltip} from '@angular/material/tooltip'
import {PlottingStatus} from '../../types/plotting-status'
import dayjs from 'dayjs'

@Component({
  selector: 'app-active-plot',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatProgressBar,
    MatTooltip,
    NgForOf
  ],
  templateUrl: './active-plot.component.html',
  styleUrl: './active-plot.component.scss'
})
export class ActivePlotComponent {
  @Input() public plottingStatus!: PlottingStatus

  public getRelativeEta(eta: string|Date): string {
    return dayjs(eta).fromNowExtended()
  }
}
