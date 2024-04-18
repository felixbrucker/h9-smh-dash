import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core'
import {ActiveInitProofsComponent} from '../active-init-proofs/active-init-proofs.component'
import {ActivePlotsComponent} from '../active-plots/active-plots.component'
import {ActiveProofsComponent} from '../active-proofs/active-proofs.component'
import {AsyncPipe, NgIf} from '@angular/common'
import {RoundInfoComponent} from '../round-info/round-info.component'
import {SystemInfoComponent} from '../system-info/system-info.component'
import {BehaviorSubject, distinctUntilChanged, map, Observable, shareReplay, Subject} from 'rxjs'
import {StartupInfo} from '../../types/startup-info'
import {PlottingStatus} from '../../types/plotting-status'
import {ActiveProof} from '../../types/active-proof'
import {PostRoundInfo} from '../../types/post-round-info'
import {io, Socket} from 'socket.io-client'
import {DashConfig} from '../../types/dash-config'
import {MatProgressSpinner} from '@angular/material/progress-spinner'
import {MatIcon} from '@angular/material/icon'
import {MatIconButton, MatMiniFabButton} from '@angular/material/button'

interface ServerToClientEvents {
  'startup-info': (startupInfo: StartupInfo) => void
  'plotting-status': (plottingStatus: Record<string, PlottingStatus>) => void
  'capacity': (capacity: string) => void
  'post-round-info': (postRoundInfo: PostRoundInfo) => void
  'active-init-proofs': (activeInitProofs: Record<string, ActiveProof>) => void
  'active-proofs': (activeProofs: Record<string, ActiveProof>) => void
}

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [
    ActiveInitProofsComponent,
    ActivePlotsComponent,
    ActiveProofsComponent,
    AsyncPipe,
    NgIf,
    RoundInfoComponent,
    SystemInfoComponent,
    MatProgressSpinner,
    MatIcon,
    MatIconButton,
    MatMiniFabButton
  ],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss'
})
export class DashComponent implements OnInit, OnDestroy {
  @Input() config!: DashConfig
  @Output() onDashDelete: EventEmitter<DashConfig> = new EventEmitter<DashConfig>()

  public get isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  public readonly startupInfo$: Observable<StartupInfo>
  public readonly plottingStatus$: Observable<PlottingStatus[]>
  public readonly activeInitProofs$: Observable<ActiveProof[]>
  public readonly activeProofs$: Observable<ActiveProof[]>
  public readonly hasActiveInitProofs$: Observable<boolean>
  public readonly hasActiveProofs$: Observable<boolean>
  public readonly hasActivePlots$: Observable<boolean>
  public readonly capacity$: Observable<string>
  public readonly postRoundInfo$: Observable<PostRoundInfo>

  private readonly startupInfoSubject: Subject<StartupInfo> = new Subject<StartupInfo>()
  private readonly plottingStatusSubject: Subject<PlottingStatus[]> = new Subject<PlottingStatus[]>()
  private readonly capacitySubject: Subject<string> = new Subject<string>()
  private readonly postRoundInfoSubject: Subject<PostRoundInfo> = new Subject<PostRoundInfo>()
  private readonly activeInitProofsSubject: BehaviorSubject<ActiveProof[]> = new BehaviorSubject<ActiveProof[]>([])
  private readonly activeProofsSubject: BehaviorSubject<ActiveProof[]> = new BehaviorSubject<ActiveProof[]>([])
  private socket?: Socket<ServerToClientEvents>

  public constructor() {
    this.startupInfo$ = this.startupInfoSubject.pipe(shareReplay(1))
    this.plottingStatus$ = this.plottingStatusSubject.pipe(shareReplay(1))
    this.capacity$ = this.capacitySubject.asObservable()
    this.postRoundInfo$ = this.postRoundInfoSubject.asObservable()
    this.activeInitProofs$ = this.activeInitProofsSubject.asObservable()
    this.activeProofs$ = this.activeProofsSubject.asObservable()
    this.hasActiveInitProofs$ = this.activeInitProofs$.pipe(map(activeInitProofs => activeInitProofs.length > 0), distinctUntilChanged())
    this.hasActiveProofs$ = this.activeProofs$.pipe(map(activeProofs => activeProofs.length > 0), distinctUntilChanged())
    this.hasActivePlots$ = this.plottingStatus$.pipe(map(plottingStatus => plottingStatus.length > 0), distinctUntilChanged())
  }

  public ngOnInit() {
    this.socket = io(this.config.monitorUrl, {
      transports: ['websocket'],
      auth: { token: this.config.authToken },
    })
    this.socket.on('startup-info', (startupInfo) => this.startupInfoSubject.next(startupInfo))
    this.socket.on('plotting-status', plottingStatus => this.plottingStatusSubject.next(Object.values(plottingStatus)))
    this.socket.on('capacity', (capacity) => this.capacitySubject.next(capacity))
    this.socket.on('post-round-info', (postRoundInfo) => this.postRoundInfoSubject.next(postRoundInfo))
    this.socket.on('active-init-proofs', activeInitProofs => this.activeInitProofsSubject.next(Object.values(activeInitProofs)))
    this.socket.on('active-proofs', activeProofs => this.activeProofsSubject.next(Object.values(activeProofs)))
  }

  public ngOnDestroy() {
    this.socket?.close()
  }

  public deleteDash() {
    this.onDashDelete.emit(this.config)
  }
}
