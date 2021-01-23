import { Component, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { KanbanService } from "src/app/services/kanban.service";
import { Board } from "src/app/interfaces/task";

@Component({
  selector: "app-kanban",
  templateUrl: "./kanban.component.html",
  styleUrls: ["./kanban.component.css"],
})
export class KanbanComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  userBoards$: Observable<Board[]>;
  activeBoard$: Observable<Board>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private kanban: KanbanService
  ) {}

  ngOnInit() {
    this.kanban.fetchUserBoards();
    this.userBoards$ = this.kanban.userBoards$;
    this.activeBoard$ = this.kanban.activeBoard$;
  }

  changeActiveBoard(board: Board) {
    this.kanban.updateActiveBoard(board);
  }

  createNewBoard() {
    this.kanban.createNewBoard();
  }
}
