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
  isHandset$: Observable<boolean>;
  userBoards$: Observable<Board[]>;
  activeBoard$: Observable<Board>;
  editBoardTitle: boolean;
  boardTitle: FormControl;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private kanban: KanbanService
  ) {}

  ngOnInit() {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => {
        this.isHandset = result.matches;
        $("#kanban-board").css("margin-top", 70);
        $("#menu").css("margin-left", "auto");
        $("#kanban-board").css("height", this.getmaxHeight());
        $("#toolbar").css(
          "width",
          this.isHandset ? "100%" : this.getmaxWidth()
        );
        return result.matches;
      }),
      shareReplay()
    );
    // $("#kanban-board").css("height", this.getmaxHeight());
    // $("#kanban-board").css("margin-top", this.isHandset ? 60 : 70);
    // $("#toolbar").css("width", this.isHandset ? "100%" : "50%");
    window.addEventListener("resize", () => {
      // console.log(this.getmaxWidth());
      $("#kanban-board").css("height", this.getmaxHeight());
      // $("#kanban-board").css("margin-top", 70);
      $("#toolbar").css("width", this.isHandset ? "100%" : this.getmaxWidth());
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

  private getmaxWidth() {
    return window.innerWidth - (this.isHandset ? 0 : $("#drawer").width());
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
