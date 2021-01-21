import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Task } from "src/app/interfaces/task";
import { KanbanService } from "src/app/services/kanban.service";

@Component({
  selector: "app-task-card",
  templateUrl: "./task-card.component.html",
  styleUrls: ["./task-card.component.css"],
})
export class TaskCardComponent implements OnInit, AfterViewChecked {
  editableTask: boolean;
  @ViewChild("taskCard") taskCard: ElementRef;
  @Input() task: Task;
  @Input() status: string;

  constructor(private kanban: KanbanService) {}

  ngOnInit(): void {}
  ngAfterViewChecked() {
    if (this.editableTask) {
      const element = this.taskCard.nativeElement;
      element.focus();
      element.setSelectionRange(element.value.length, element.value.length);
    }
  }

  editTask() {
    this.editableTask = true;
  }

  save() {
    this.editableTask = false;
    // TODO
  }
}
