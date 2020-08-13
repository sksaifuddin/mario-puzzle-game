import { Component, HostListener, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  DOWN_ARROW = 40,
  UP_ARROW = 38,
}

interface CharacterPosition {
  row: number;
  column: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'maze-game';
  refresh: boolean = true;
  rows = new Array(10);
  columns =  new Array(10);
  marioPosition: CharacterPosition = {
    row: 5,
    column: 5
  }
  toadPosition: CharacterPosition[] = []
  totalStepCounts: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor() {}

  ngOnInit(): void {
    while(this.toadPosition.length < 10) {
      const rowNumber = this.uniqueRandom();
      const obj = { row:  rowNumber, column: this.uniqueRandom(rowNumber)};
      this.toadPosition.push(obj);
  }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.totalStepCounts.next(this.totalStepCounts.getValue()+1);
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      console.log('right arrow pressed');
      this.marioPosition.row = ++this.marioPosition.row;
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      console.log('left arrow pressed');
      this.marioPosition.row = --this.marioPosition.row;
    }

    if (event.keyCode === KEY_CODE.UP_ARROW) {
      console.log('up arrow pressed');
      this.marioPosition.column = --this.marioPosition.column;
    }

    if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      console.log('down arrow pressed');
      this.marioPosition.column = ++this.marioPosition.column;
    }

    this.toadPosition = this.toadPosition.filter((positions: CharacterPosition) => 
        !(positions.row === this.marioPosition.row && positions.column === this.marioPosition.column)
    )

    if(this.toadPosition.length === 0) {
      window.alert(`You completed in ${this.totalStepCounts.getValue()} steps`);
    }
    console.log('remaining positions', this.toadPosition);

  }

  checkToad(rowIndex: number, columnIndex: number): boolean {    
   return this.toadPosition.filter((positions: CharacterPosition) => 
        positions.row === rowIndex && positions.column === columnIndex).length === 1;
  }

  uniqueRandom(...compareNumbers): number {
    let uniqueNumber;
    do {
        uniqueNumber = Math.floor(Math.random() * 9);
    } while(compareNumbers.includes(uniqueNumber));
    return uniqueNumber;
  }

}


