import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Board, Task } from "../interfaces/task";
import { v1 as uuidv1 } from "uuid";

@Injectable({
  providedIn: "root",
})
export class KanbanService {
  // Active board state
  private kanbanBoard: BehaviorSubject<Board> = new BehaviorSubject(null);
  kanbanBoard$ = this.kanbanBoard.asObservable();

  constructor() {}

  // update board state
  updateBoardState(board: Board) {
    // console.log(board);
    this.kanbanBoard.next(board);
    localStorage.setItem("board", JSON.stringify(board));
  }

  // fetch board from local storage
  fetchBoard() {
    // let boardsList: Board[] = [];
    let boardString = localStorage.getItem("board");
    let board: Board;
    if (boardString) {
      board = JSON.parse(boardString);
    } else {
      // create a new list
      board = this.createNewBoard();
    }
    this.updateBoardState(board);
  }

  createNewBoard(): Board {
    const newBoard: Board = {
      title: "Untitled board",
      tasks: [
        {
          title: "No status",
          tasks: [
            {
              title: "",
              uid: uuidv1(),
            },
            {
              title: "",
              uid: uuidv1(),
            },
            {
              title: "",
              uid: uuidv1(),
            },
          ],
        },
        {
          title: "Not started",
          tasks: [],
        },
        {
          title: "In progress",
          tasks: [],
        },
        {
          title: "Completed",
          tasks: [],
        },
      ],
    };
    return newBoard;
  }

  EditBoard(status: String, task: Task) {
    const currentBoard = this.kanbanBoard.value;
    const currentStatusIndex = currentBoard.tasks.findIndex(
      (t) => t.title === status
    );
    if (currentStatusIndex >= 0) {
      const currentStatus = currentBoard.tasks[currentStatusIndex];
      const currentTaskIndex = currentStatus.tasks.findIndex(
        (t) => t.uid === task.uid
      );
      if (currentTaskIndex >= 0) {
        const currentTask = currentStatus.tasks[currentTaskIndex];
        currentTask.title = task.title;
        // console.log(currentBoard);
        this.updateBoardState(currentBoard);
      } else {
        currentStatus.tasks.push(task);
      }
    }
  }
}
