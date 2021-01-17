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
    this.kanban.fetchBoard().subscribe((board) => {
      // console.log(board);
      this.board = board;
      this.kanban.updateBoardState(this.board);
      for (const status of board.tasks) {
        // console.log(status.title);
        this.rowKeys.push(status.title);
        this.boardModified[status.title] = status.tasks;
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
    this.kanban.updateBoardState(this.board);
    // console.log("data after dragging completed", this.board);
  }
}
