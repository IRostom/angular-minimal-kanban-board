import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Board, Task } from "../interfaces/task";
import { v1 as uuidv1 } from "uuid";
import { DomSanitizer } from "@angular/platform-browser";

@Injectable({
  providedIn: "root",
})
export class KanbanService {
  // Active board state
  private activeBoard: BehaviorSubject<Board> = new BehaviorSubject(null);
  activeBoard$ = this.activeBoard.asObservable();

  // user boards state
  private userBoards: BehaviorSubject<Board[]> = new BehaviorSubject(null);
  userBoards$ = this.userBoards.asObservable();

  constructor(private sanitizer: DomSanitizer) {}

  updateActiveBoard(board: Board, updateStorage: boolean = true) {
    // update active board state
    this.activeBoard.next(board);

    if (updateStorage) {
      // update the board in local storage
      const boardsString = localStorage.getItem("boards");
      const boards: Board[] = JSON.parse(boardsString);
      const index = boards.findIndex((b) => b.uid === board.uid);
      if (index >= 0) {
        boards[index] = board;
        this.updateUserBoards(boards);
        // localStorage.setItem("boards", JSON.stringify(boards));
      }
    }
  }

  updateUserBoards(boards: Board[], updateStorage: boolean = true) {
    // update user boards state
    this.userBoards.next(boards);

    if (updateStorage) {
      // update the user boards list in local storage
      localStorage.setItem("boards", JSON.stringify(boards));
    }
  }

  // use only on startup
  fetchUserBoards() {
    // let boardsList: Board[] = [];
    let boardString = localStorage.getItem("boards");
    let boards: Board[] = [];
    if (boardString) {
      boards = JSON.parse(boardString);
    } else {
      // create a new list
      boards.push(this.createEmptyBoard());
      localStorage.setItem("boards", JSON.stringify(boards));
    }
    this.updateUserBoards(boards, false);
    this.updateActiveBoard(boards[0], false);
  }

  createNewBoard() {
    const emptyBoard = this.createEmptyBoard();
    const userBoards = this.userBoards.value;
    userBoards.push(emptyBoard);
    this.updateUserBoards(userBoards);
    this.updateActiveBoard(emptyBoard, false);
  }

  createEmptyBoard(): Board {
    const newBoard: Board = {
      title: "Untitled board",
      uid: uuidv1(),
      status: [
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

  editActiveBoard(status: String, task: Task) {
    const currentBoard = this.activeBoard.value;
    const currentStatusIndex = currentBoard.status.findIndex(
      (t) => t.title === status
    );
    if (currentStatusIndex >= 0) {
      const currentStatus = currentBoard.status[currentStatusIndex];
      const currentTaskIndex = currentStatus.tasks.findIndex(
        (t) => t.uid === task.uid
      );
      if (currentTaskIndex >= 0) {
        const currentTask = currentStatus.tasks[currentTaskIndex];
        currentTask.title = task.title;
        // console.log(currentBoard);
        // this.updateActiveBoard(currentBoard);
      } else {
        currentStatus.tasks.push(task);
      }
      this.updateActiveBoard(currentBoard);
    }
  }

  deleteBoard() {
    const boards: Board[] = this.userBoards.getValue();
    const activeBoard: Board = this.activeBoard.getValue();
    const index = boards.findIndex((b) => b.uid === activeBoard.uid);
    console.log(index);

    if (index >= 0) {
      boards.splice(index, 1);
      console.log(boards);
      this.updateActiveBoard(boards[0], false);
      this.updateUserBoards(boards);
    }
  }

  renameBoard(title: string) {
    const activeBoard: Board = this.activeBoard.getValue();
    activeBoard.title = title;
    this.updateActiveBoard(activeBoard);
  }

  exportBoardToJSON() {
    var theJSON = JSON.stringify(this.activeBoard.getValue());
    var uri = this.sanitizer.bypassSecurityTrustUrl(
      "data:text/json;charset=UTF-8," + encodeURIComponent(theJSON)
    );
    return uri;
  }
}
