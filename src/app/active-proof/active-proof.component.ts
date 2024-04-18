import {Component, Input} from '@angular/core'
import {AsyncPipe, NgForOf} from '@angular/common'
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card'
import {ActiveProof, ActiveProofState} from '../../types/active-proof'
import dayjs from 'dayjs'

@Component({
  selector: 'app-active-proof',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    NgForOf
  ],
  templateUrl: './active-proof.component.html',
  styleUrl: './active-proof.component.scss'
})
export class ActiveProofComponent {
  @Input() public activeProof!: ActiveProof

  public getElapsedTime(date: string|Date): string {
    return dayjs(date).toNowExtended()
  }

  public formatState(state: ActiveProofState): string {
    switch (state) {
      case ActiveProofState.generatingK2Pow: return 'generating k2pow'
      case ActiveProofState.readingProofOfSpace: return 'reading POS'
    }
  }
}
