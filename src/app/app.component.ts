import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AsyncPipe, JsonPipe, KeyValuePipe, NgForOf, NgIf} from '@angular/common'
import {MatChip, MatChipListbox, MatChipOption, MatChipSet} from '@angular/material/chips'
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card'
import {MatProgressBar} from '@angular/material/progress-bar'
import {MatGridList, MatGridTile} from '@angular/material/grid-list'
import {MatFormField, MatLabel} from '@angular/material/form-field'
import {MatInput} from '@angular/material/input'
import {FormsModule} from '@angular/forms'
import {MatButton} from '@angular/material/button'
import {MatTooltip} from '@angular/material/tooltip'
import {SystemInfoComponent} from './system-info/system-info.component'
import {RoundInfoComponent} from './round-info/round-info.component'
import {ActiveInitProofsComponent} from './active-init-proofs/active-init-proofs.component'
import {ActiveProofsComponent} from './active-proofs/active-proofs.component'
import {ActivePlotsComponent} from './active-plots/active-plots.component'
import {DashComponent} from './dash/dash.component'
import {DashConfig} from '../types/dash-config'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf, AsyncPipe, JsonPipe, NgIf, KeyValuePipe, MatChipSet, MatChip, MatChipListbox, MatChipOption, MatCard, MatCardContent, MatCardHeader, MatCardFooter, MatProgressBar, MatCardTitle, MatCardSubtitle, MatGridList, MatGridTile, MatFormField, MatInput, FormsModule, MatLabel, MatButton, MatTooltip, SystemInfoComponent, RoundInfoComponent, ActiveInitProofsComponent, ActiveProofsComponent, ActivePlotsComponent, DashComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public get isConnectButtonDisabled(): boolean {
    return !this.monitorUrl || !this.authToken || this.isCurrentConfigKnown
  }

  public monitorUrl?: string
  public authToken?: string

  public dashboardConfigs: DashConfig[] = []

  private get storedDashboardConfigs(): DashConfig[] {
    const rawDashboardConfigs = localStorage.getItem('dashboardConfigs') ?? undefined
    if (rawDashboardConfigs === undefined) {
      return []
    }

    return JSON.parse(rawDashboardConfigs)
  }

  private get isCurrentConfigKnown(): boolean {
    return this.dashboardConfigs.some(config => config.monitorUrl === this.monitorUrl && config.authToken === this.authToken)
  }

  public constructor() {
    this.dashboardConfigs = this.storedDashboardConfigs
  }

  public connect() {
    if (this.monitorUrl === undefined || this.authToken === undefined) {
      return
    }
    this.dashboardConfigs.push({
      monitorUrl: this.monitorUrl,
      authToken: this.authToken,
      isDisabled: false,
    })
    this.persistDashboards()
    this.monitorUrl = undefined
    this.authToken = undefined
  }

  public deleteDash(config: DashConfig) {
    this.dashboardConfigs = this.dashboardConfigs.filter(curr => config.monitorUrl !== curr.monitorUrl && config.authToken !== curr.authToken)
    this.persistDashboards()
  }

  public persistDashboards() {
    localStorage.setItem('dashboardConfigs', JSON.stringify(this.dashboardConfigs))
  }
}
