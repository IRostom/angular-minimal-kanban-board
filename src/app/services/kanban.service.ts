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

  // current Editable Task state
  private editTask: BehaviorSubject<Task> = new BehaviorSubject(null);
  editTask$ = this.editTask.asObservable();

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

  // update board state
  updateEditTask(task: Task) {
    // console.log(task);
    this.editTask.next(task);
  }
}
