import { Component, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { KanbanService } from "src/app/services/kanban.service";
import { Board } from "src/app/interfaces/task";
import * as $ from "jquery";
import { FormControl } from "@angular/forms";
@Component({
  selector: "app-kanban",
  templateUrl: "./kanban.component.html",
  styleUrls: ["./kanban.component.css"],
})
export class KanbanComponent implements OnInit {
  isHandset: boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => {
        this.isHandset = result.matches;
        return result.matches;
      }),
      shareReplay()
    );
  userBoards$: Observable<Board[]>;
  activeBoard$: Observable<Board>;
  editBoardTitle: boolean;
  boardTitle: FormControl;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private kanban: KanbanService
  ) {}

  ngOnInit() {
    $("#kanban-board").css("height", this.getmaxHeight());
    $("#kanban-board").css("margin-top", this.isHandset ? 60 : 70);
    window.addEventListener("resize", () => {
      $("#kanban-board").css("height", this.getmaxHeight());
      $("#kanban-board").css("margin-top", this.isHandset ? 60 : 70);
    });
    this.kanban.fetchUserBoards();
    this.userBoards$ = this.kanban.userBoards$;
    this.boardTitle = new FormControl();
    this.activeBoard$ = this.kanban.activeBoard$.pipe(
      map((board) => {
        if (board) {
          this.boardTitle.setValue(board.title);
        } else {
          this.boardTitle.setValue("Untitled Board");
        }
        return board;
      })
    );
    this.editBoardTitle = false;
  }

  changeActiveBoard(board: Board) {
    this.kanban.updateActiveBoard(board);
  }

  createNewBoard() {
    this.kanban.createNewBoard();
  }

  private getmaxHeight() {
    return window.innerHeight - (this.isHandset ? 56 : 64) - 10;
  }

  deleteBoard() {
    this.kanban.deleteBoard();
  }

  renameBoard() {
    this.editBoardTitle = true;
  }

  saveBoardTitle() {
    this.editBoardTitle = false;
    // console.log(this.boardTitle.value);
    this.kanban.renameBoard(this.boardTitle.value);
  }

  exportJSON() {
    // console.log(this.boardTitle.value);

    return this.kanban.exportBoardToJSON();
  }
}
