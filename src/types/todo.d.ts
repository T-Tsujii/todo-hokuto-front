type TodoElements = {
  component: HTMLElement;
  message: HTMLElement;
  input: HTMLInputElement;
  incomplete: HTMLElement;
  complete: HTMLElement;
};

type Todo = {
  tasks: Task[];
  elements: TodoElements;
  alert: NodeJS.Timeout | undefined;
  baseUrl: string;
  authorization: string;
  sending: boolean;
};
