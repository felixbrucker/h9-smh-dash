import {Component, Input} from '@angular/core'
import {AsyncPipe, NgForOf} from '@angular/common'
import {Observable} from 'rxjs'
import {ActiveProof} from '../../types/active-proof'
import {ActiveProofComponent} from '../active-proof/active-proof.component'

@Component({
  selector: 'app-active-init-proofs',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    ActiveProofComponent
  ],
  templateUrl: './active-init-proofs.component.html',
  styleUrl: './active-init-proofs.component.scss'
})
export class ActiveInitProofsComponent {
  @Input() public activeInitProofs$!: Observable<ActiveProof[]>
}
