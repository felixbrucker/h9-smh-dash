import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {io, Socket} from 'socket.io-client'
import {StartupInfo} from '../types/startup-info'
import {PlottingStatus} from '../types/plotting-status'
import {BehaviorSubject, map, Observable, shareReplay, Subject} from 'rxjs'
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
import dayjs from 'dayjs'
import {MatFormField, MatLabel} from '@angular/material/form-field'
import {MatInput} from '@angular/material/input'
import {FormsModule} from '@angular/forms'
import {MatButton} from '@angular/material/button'
import {PostRoundInfo} from '../types/post-round-info'
import {ActiveInitProof, ActiveInitProofState} from '../types/active-init-proof'
import {MatTooltip} from '@angular/material/tooltip'
import {relativeTimeExtended} from '../extensions/relative-time-extended'


dayjs.extend(relativeTimeExtended)

interface ServerToClientEvents {
  'startup-info': (startupInfo: StartupInfo) => void
  'plotting-status': (plottingStatus: Record<string, PlottingStatus>) => void
  'capacity': (capacity: string) => void
  'post-round-info': (postRoundInfo: PostRoundInfo) => void
  'active-init-proofs': (activeInitProofs: Record<string, ActiveInitProof>) => void
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf, AsyncPipe, JsonPipe, NgIf, KeyValuePipe, MatChipSet, MatChip, MatChipListbox, MatChipOption, MatCard, MatCardContent, MatCardHeader, MatCardFooter, MatProgressBar, MatCardTitle, MatCardSubtitle, MatGridList, MatGridTile, MatFormField, MatInput, FormsModule, MatLabel, MatButton, MatTooltip],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public get isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  public monitorUrl?: string
  public authToken?: string
  public readonly startupInfo$: Observable<StartupInfo>
  public readonly plottingStatus$: Observable<PlottingStatus[]>
  public readonly activeInitProofs$: Observable<ActiveInitProof[]>
  public readonly hasActiveInitProofs$: Observable<boolean>
  public readonly capacity$: Observable<string>
  public readonly postRoundInfo$: Observable<PostRoundInfo>
  private readonly startupInfoSubject: Subject<StartupInfo> = new Subject<StartupInfo>()
  private readonly plottingStatusSubject: Subject<PlottingStatus[]> = new Subject<PlottingStatus[]>()
  private readonly capacitySubject: Subject<string> = new Subject<string>()
  private readonly postRoundInfoSubject: Subject<PostRoundInfo> = new Subject<PostRoundInfo>()
  private readonly activeInitProofsSubject: BehaviorSubject<ActiveInitProof[]> = new BehaviorSubject<ActiveInitProof[]>([])
  private socket?: Socket<ServerToClientEvents>

  public constructor() {
    this.startupInfo$ = this.startupInfoSubject.pipe(shareReplay(1))
    this.plottingStatus$ = this.plottingStatusSubject.asObservable()
    this.capacity$ = this.capacitySubject.asObservable()
    this.postRoundInfo$ = this.postRoundInfoSubject.asObservable()
    this.activeInitProofs$ = this.activeInitProofsSubject.asObservable()
    this.hasActiveInitProofs$ = this.activeInitProofs$.pipe(map(activeInitProofs => activeInitProofs.length > 0))
    this.monitorUrl = localStorage.getItem('monitorUrl') ?? undefined
    this.authToken = localStorage.getItem('authToken') ?? undefined
    this.connect()
  }

  public connect() {
    localStorage.setItem('monitorUrl', this.monitorUrl ?? '')
    localStorage.setItem('authToken', this.authToken ?? '')
    if (!this.monitorUrl || !this.authToken) {
      return
    }
    this.socket = io(this.monitorUrl, {
      transports: ['websocket'],
      auth: { token: this.authToken },
    })
    this.socket.on('startup-info', (startupInfo) => this.startupInfoSubject.next(startupInfo))
    this.socket.on('plotting-status', plottingStatus => this.plottingStatusSubject.next(Object.values(plottingStatus)))
    this.socket.on('capacity', (capacity) => this.capacitySubject.next(capacity))
    this.socket.on('post-round-info', (postRoundInfo) => this.postRoundInfoSubject.next(postRoundInfo))
    this.socket.on('active-init-proofs', activeInitProofs => this.activeInitProofsSubject.next(Object.values(activeInitProofs)))
  }

  public trackBy(index: number, plottingStatus: PlottingStatus): string {
    return plottingStatus.nodeId
  }

  public getRelativeEta(eta: string|Date): string {
    return dayjs(eta).fromNowExtended()
  }

  public getElapsedTime(date: string|Date): string {
    return dayjs(date).toNowExtended()
  }

  public formatState(state: ActiveInitProofState): string {
    switch (state) {
      case ActiveInitProofState.generatingK2Pow: return 'generating k2pow'
      case ActiveInitProofState.readingProofOfSpace: return 'reading POS'
    }
  }

  public getFormattedDate(date: string|Date): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm')
  }
}
