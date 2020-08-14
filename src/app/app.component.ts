import { Component, HostListener, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KEY_CODE } from './models/key-code.enum';
import { CharacterPosition } from './models/character-position.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  refresh: boolean = true;
  mazeHeight: number;
  mazeWidth: number;
  rows: any = [];
  columns: any = [];
  marioPosition: CharacterPosition = { row: 0, column: 0 };
  toadPosition: CharacterPosition[] = [];
  private totalStepCountsSubject: BehaviorSubject<number> = new BehaviorSubject(
    0
  );
  private renderBoardSubject: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  renderBoard$ = this.renderBoardSubject.asObservable();

  constructor() {}

  ngOnInit(): void {
    this.takeBoardDimensionsFromUser();
    this.setMarioPositions();
    this.setBoardDimensions();
    this.setRandomToadPositions();10
    this.renderBoardSubject.next(true);
  }

  private takeBoardDimensionsFromUser(): void {
    this.mazeWidth = +prompt('please enter width');
    this.mazeHeight = +prompt('please enter Height');
  }

  private setMarioPositions(): void {
    this.marioPosition.row = Math.round(this.mazeWidth / 2) - 1;
    this.marioPosition.column = Math.round(this.mazeHeight / 2) - 1;
  }

  private setBoardDimensions(): void {
    this.rows = new Array(this.mazeWidth);
    this.columns = new Array(+this.mazeWidth);
  }

  private setRandomToadPositions(): void {
    while (
      this.toadPosition.length <
      Math.round((this.mazeHeight + this.mazeWidth) / 2)
    ) {
      const rowNumber = this.uniqueRandom();
      const obj: CharacterPosition = {
        row: rowNumber,
        column: this.uniqueRandom(rowNumber),
      };
      this.toadPosition.push(obj);
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    
    this.increaseStepCount();
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.marioPosition.row = ++this.marioPosition.row;
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.marioPosition.row = --this.marioPosition.row;
    }

    if (event.keyCode === KEY_CODE.UP_ARROW) {
      this.marioPosition.column = --this.marioPosition.column;
    }

    if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      this.marioPosition.column = ++this.marioPosition.column;
    }

    this.checkMarioGetsToad();
  }

  private increaseStepCount(): void {
    this.totalStepCountsSubject.next(this.totalStepCountsSubject.getValue() + 1);
  }

  checkMarioGetsToad(): void {
    this.toadPosition = this.checkMarioCrossesToad();
    if (this.toadPosition.length === 0) {
      window.alert(
        `You completed in ${this.totalStepCountsSubject.getValue()} steps`
      );
    }
  }

  private checkMarioCrossesToad(): CharacterPosition[] {
    return this.toadPosition.filter((positions: CharacterPosition) =>
    !(
      positions.row === this.marioPosition.row &&
      positions.column === this.marioPosition.column
      )
    );
  }

  checkToad(rowIndex: number, columnIndex: number): boolean {
    return (
      this.toadPosition.filter(
        (positions: CharacterPosition) =>
          positions.row === rowIndex && positions.column === columnIndex
      ).length > 0
    );
  }

  private uniqueRandom(...compareNumbers): number {
    let uniqueNumber: number;
    do {
      uniqueNumber = Math.floor(
        Math.random() * Math.round((this.mazeHeight + this.mazeWidth) / 2)
      );
    } while (compareNumbers.includes(uniqueNumber));
    return uniqueNumber;
  }
}
