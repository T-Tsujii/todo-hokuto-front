import { Task } from './task';
import { TaskData } from '../types/task';

export class Todo {
  tasks: Task[] = [];
  elements: TodoElements;
  alert: NodeJS.Timeout | undefined;
  baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  authorization = `Bearer ${process.env.TOKEN}`;
  sending = false;

  constructor(component: HTMLElement) {
    this.elements = this.#setElements(component);
    this.#fetchTasks().then(() => {
      this.tasks.forEach((task) => this.#addTask(task));
      this.#addInputEvent();
    });
  }

  #setElements = (component: HTMLElement): TodoElements => {
    const message = component.querySelector('.message-area');
    const input = component.querySelector('.new-task-input');
    const incomplete = component.querySelector('.incomplete-panel');
    const complete = component.querySelector('.complete-panel');

    if (
      message instanceof HTMLElement &&
      input instanceof HTMLInputElement &&
      incomplete instanceof HTMLElement &&
      complete instanceof HTMLElement
    ) {
      return {
        component,
        message,
        input,
        incomplete,
        complete,
      };
    } else {
      throw new Error('必要なセレクターが不足しています。');
    }
  };

  #fetchTasks = async (): Promise<void> => {
    const messageElement = this.elements.message;
    messageElement.textContent = '受信中……';
    try {
      const response = await fetch(this.baseUrl, {
        headers: {
          Authorization: this.authorization,
        },
      });
      if (!response.ok) throw new Error(`${response.status} (${response.statusText})`);
      const data: TaskData[] = await response.json();
      messageElement.style.opacity = '0';
      data.forEach((taskData) => this.tasks.push(new Task(taskData, this)));
    } catch (e) {
      alert(e.message);
      messageElement.textContent = '通信に失敗しました。リロードして下さい。';
    }
  };

  #addTask = (task: Task): void => {
    if (task.data.isCompleted) {
      this.elements.complete.prepend(task.component);
    } else {
      this.elements.incomplete.appendChild(task.component);
    }
    task.addClickEvents();
  };

  #addInputEvent = (): void => {
    this.elements.input.addEventListener('keypress', (e) => {
      const body = this.elements.input.value;
      if (body && e instanceof KeyboardEvent && e.key === 'Enter') {
        this.#postTodo(body);
      }
    });
  };

  #postTodo = async (body: string): Promise<void> => {
    this.elements.input.value = '';
    if (this.sending) return;

    this.sending = true;
    this.elements.input.placeholder = '送信中……';
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          Authorization: this.authorization,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body }),
      });
      if (!response.ok) throw new Error(`${response.status} (${response.statusText})`);
      const data: { task: TaskData; message: string } = await response.json();
      const task = new Task(data.task, this);
      this.#addTask(task);
      this.#displayAlert(data.message, 3000);
    } catch (e) {
      alert(e.message);
    } finally {
      this.sending = false;
      this.elements.input.placeholder = '';
    }
  };

  #displayAlert = (message: string, timeout: number): void => {
    if (this.alert) clearTimeout(this.alert);
    this.elements.message.textContent = message;
    this.elements.message.style.opacity = '1';
    this.alert = setTimeout(() => {
      this.elements.message.style.opacity = '0';
    }, timeout);
  };
}
