export interface Task {
  title: string;
  uid: string;
}

export interface Status {
  title: string;
  tasks: Task[];
}

export interface Board {
  title: string;
  uid: string;
  status: Status[];
}
