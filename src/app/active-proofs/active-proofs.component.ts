import {Component, Input} from '@angular/core'
import {ActiveProofComponent} from '../active-proof/active-proof.component'
import {AsyncPipe, NgForOf} from '@angular/common'
import {Observable} from 'rxjs'
import {ActiveProof} from '../../types/active-proof'

@Component({
  selector: 'app-active-proofs',
  standalone: true,
  imports: [
    ActiveProofComponent,
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './active-proofs.component.html',
  styleUrl: './active-proofs.component.scss'
})
export class ActiveProofsComponent {
  @Input() public activeProofs$!: Observable<ActiveProof[]>
}
