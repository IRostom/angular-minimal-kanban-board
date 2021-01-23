import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Task } from "src/app/interfaces/task";
import { KanbanService } from "src/app/services/kanban.service";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-task-card",
  templateUrl: "./task-card.component.html",
  styleUrls: ["./task-card.component.css"],
})
export class TaskCardComponent implements OnInit, AfterViewChecked, OnChanges {
  editableTask: boolean;
  @ViewChild("taskCard") taskCard: ElementRef;
  @Input() task: Task;
  @Input() status: string;
  @Input() edit: boolean;
  form: FormGroup;
  title = new FormControl("");

  constructor(private fb: FormBuilder, private kanban: KanbanService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: this.title,
    });
    this.title.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        // update title
        if (this.task) {
          this.task.title = value;
          this.kanban.EditActiveBoard(this.status, this.task);
        } else {
          this.title.setValue("");
        }
      });
  }

  ngAfterViewChecked() {
    if (this.editableTask) {
      const element = this.taskCard.nativeElement;
      element.focus();
      element.setSelectionRange(element.value.length, element.value.length);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.task?.currentValue) {
      this.task = changes.task.currentValue;
    }
    if (changes.task?.currentValue?.title) {
      this.title.setValue(changes.task.currentValue.title);
    }
    if (changes.edit.currentValue) {
      this.edit = changes.edit.currentValue;
      if (this.edit) {
        this.editTask();
      }
    }
  }

  editTask() {
    this.editableTask = true;
  }

  save() {
    this.editableTask = false;
  }
}
