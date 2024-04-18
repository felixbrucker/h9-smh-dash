import {Component, Input} from '@angular/core'
import {AsyncPipe} from '@angular/common'
import {MatChip, MatChipSet} from '@angular/material/chips'
import {Observable} from 'rxjs'
import {StartupInfo} from '../../types/startup-info'

@Component({
  selector: 'app-system-info',
  standalone: true,
  imports: [
    AsyncPipe,
    MatChip,
    MatChipSet
  ],
  templateUrl: './system-info.component.html',
  styleUrl: './system-info.component.scss'
})
export class SystemInfoComponent {
  @Input() public startupInfo$!: Observable<StartupInfo>
  @Input() public capacity$!: Observable<string>
}
