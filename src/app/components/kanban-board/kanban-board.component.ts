import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Board, Task } from "src/app/interfaces/task";
import { KanbanService } from "src/app/services/kanban.service";
import { v1 as uuidv1 } from "uuid";
@Component({
  selector: "app-kanban-board",
  templateUrl: "./kanban-board.component.html",
  styleUrls: ["./kanban-board.component.css"],
})
export class KanbanBoardComponent implements OnInit {
  rowKeys: string[] = [];
  board: Board = null;
  boardModified = {};
  editableTaskUid: string;
  @ViewChild("task") taskCard: ElementRef;
  constructor(private kanban: KanbanService) {}

  ngOnInit(): void {
    this.kanban.activeBoard$.subscribe(
      (board) => {
        // console.log(board);
        if (board) {
          this.board = board;
          for (const status of board.status) {
            if (this.rowKeys.findIndex((el) => el === status.title) < 0) {
              this.rowKeys.push(status.title);
            }
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
      // console.log("same container drop");
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
    this.kanban.updateActiveBoard(this.board);
    // console.log("data after dragging completed", this.board);
  }

  addTask(status: String) {
    const task: Task = {
      title: "",
      uid: uuidv1(),
    };
    const statusIndex = this.board.status.findIndex(
      (el) => el.title === status
    );
    if (statusIndex >= 0) {
      this.kanban.EditActiveBoard(status, task);
      this.editableTaskUid = task.uid;
    }
  }

  editTask(uid: string) {
    if (this.editableTaskUid === uid) {
      // this.editableTaskUid = null;
      return true;
    } else {
      return false;
    }
  }
}
