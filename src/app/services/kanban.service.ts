import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Board, Task } from "../interfaces/task";

@Injectable({
  providedIn: "root",
})
export class KanbanService {
  // Active board state
  private kanbanBoard: BehaviorSubject<Board> = new BehaviorSubject(null);
  kanbanBoard$ = this.kanbanBoard.asObservable();

  constructor(private http: HttpClient) {}

  // fetch board data
  fetchBoard(): Observable<Board> {
    return this.http.get<Board>("assets/kanban-starter.json");
  }

  // update board state
  updateBoardState(board: Board) {
    // console.log(board);
    this.kanbanBoard.next(board);
    // localStorage.setItem(board.title, JSON.stringify(board));
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
