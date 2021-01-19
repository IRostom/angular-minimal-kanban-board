import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { Component, OnInit } from "@angular/core";
import { Board, Task } from "src/app/interfaces/task";
import { KanbanService } from "src/app/services/kanban.service";

@Component({
  selector: "app-kanban-board",
  templateUrl: "./kanban-board.component.html",
  styleUrls: ["./kanban-board.component.css"],
})
export class KanbanBoardComponent implements OnInit {
  rowKeys: string[] = [];
  board: Board = null;
  boardModified = {};
  constructor(private kanban: KanbanService) {}

  ngOnInit(): void {
    this.kanban.fetchBoard().subscribe(
      (board) => {
        // console.log(board);
        if (board) {
          this.kanban.updateBoardState(board);
        }
      },
      (e) => {
        console.log(e);
      }
    );

    this.kanban.kanbanBoard$.subscribe(
      (board) => {
        console.log(board);
        if (board) {
          this.board = board;
          for (const status of board.tasks) {
            // console.log(
            //   "status:",
            //   status.title,
            //   "found:",
            //   this.rowKeys.findIndex((el) => el === status.title)
            // );
            if (this.rowKeys.findIndex((el) => el === status.title) < 0) {
              // console.log("added");
              this.rowKeys.push(status.title);
            }
            // console.log(this.rowKeys);
            this.boardModified[status.title] = status.tasks;
          }
        }
      },
      (e) => {
        console.log(e);
      }
    );
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
    this.kanban.updateBoardState(this.board);
    // console.log("data after dragging completed", this.board);
  }

  addTask(status: String) {
    const task: Task = {
      title: "",
      uid: "",
    };
    const index = this.board.tasks.findIndex((el) => el.title === status);
    if (index >= 0) {
      this.board.tasks[index].tasks.push(task);
      this.kanban.updateBoardState(this.board);
    }
  }
}
