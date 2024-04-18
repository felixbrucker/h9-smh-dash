import {Component, Input} from '@angular/core'
import {AsyncPipe, NgForOf} from '@angular/common'
import {Observable} from 'rxjs'
import {PlottingStatus} from '../../types/plotting-status'
import {ActivePlotComponent} from '../active-plot/active-plot.component'

@Component({
  selector: 'app-active-plots',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    ActivePlotComponent
  ],
  templateUrl: './active-plots.component.html',
  styleUrl: './active-plots.component.scss'
})
export class ActivePlotsComponent {
  @Input() public plottingStatus$!: Observable<PlottingStatus[]>

  public trackBy(index: number, plottingStatus: PlottingStatus): string {
    return plottingStatus.nodeId
  }
}
