import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Task } from "src/app/interfaces/task";

@Component({
  selector: "app-kanban-board",
  templateUrl: "./kanban-board.component.html",
  styleUrls: ["./kanban-board.component.css"],
})
export class KanbanBoardComponent implements OnInit {
  rowKeys: string[] = [];
  board: {};
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get("assets/kanban-starter.json").subscribe((board) => {
      this.board = board;
      for (const key in board) {
        console.log(key);
        this.rowKeys.push(key);
        // this.board[key] = board
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      console.log("same container drop");
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    console.log("data after dragging completed", this.board);
  }
}
