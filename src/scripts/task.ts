import { TaskData } from '../types/task';

export class Task {
  todo: Todo;
  component: HTMLElement;
  data: TaskData;
  hp: number;

  constructor(data: TaskData, todo: Todo) {
    this.data = data;
    this.component = this.#setComponent();
    this.todo = todo;
    this.hp = this.#setHp();
  }

  addClickEvents = (): void => {
    const body = this.component.querySelector('.task-body');
    const deleteButton = this.component.querySelector('.task-delete');
    if (body instanceof HTMLElement && deleteButton instanceof HTMLElement) {
      body.addEventListener('click', this.#changeCompleted);
      deleteButton.addEventListener('click', this.#delete);
    }
  };

  #changeCompleted = async (e: MouseEvent): Promise<void> => {
    if (this.todo.sending) return;
    if (!this.data.isCompleted && this.hp > 0) {
      this.hp--;
      this.#attackMessage(e);
      return;
    }

    this.todo.sending = true;
    if (!this.data.isCompleted) this.#deadMessage(e);
    try {
      const response = await fetch(`${this.todo.baseUrl}/${this.data.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: this.todo.authorization,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: this.data.id, isCompleted: !this.data.isCompleted }),
      });
      if (!response.ok) throw new Error(`${response.status} (${response.statusText})`);
      const data: TaskData = await response.json();
      this.data.isCompleted = data.isCompleted;

      if (data.isCompleted) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        this.todo.elements.complete.prepend(this.component);
      } else {
        this.todo.elements.incomplete.appendChild(this.component);
        this.hp = this.#setHp();
      }
    } catch (e) {
      alert(e.message);
    } finally {
      this.todo.sending = false;
    }
  };

  #delete = async (): Promise<void> => {
    if (this.todo.sending) return;

    this.todo.sending = true;
    try {
      this.component.style.opacity = '0';
      const response = await fetch(`${this.todo.baseUrl}/${this.data.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: this.todo.authorization,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`${response.status} (${response.statusText})`);
      const target = this.data.isCompleted ? this.todo.elements.complete : this.todo.elements.incomplete;
      target.removeChild(this.component);
    } catch (e) {
      alert(e.message);
      this.component.style.opacity = '1';
    } finally {
      this.todo.sending = false;
    }
  };

  #setComponent = (): HTMLElement => {
    const body = document.createElement('div');
    body.className = 'task-body';
    body.innerText = this.data.body;

    const deleteButton = document.createElement('div');
    deleteButton.className = 'task-delete';
    deleteButton.innerHTML = '<i class="far fa-trash-alt"></i>';

    let component = document.createElement('div');
    component.className = `task task-${this.data.id}`;
    component.appendChild(body);
    component.appendChild(deleteButton);

    return component;
  };

  #setHp = (): number => {
    const min = 5,
      max = 10;
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };

  #attackMessage = (e: MouseEvent): void => {
    const taskBody = e.target;
    if (!(taskBody instanceof HTMLElement)) return;
    const message = document.createElement('div');
    message.className = 'message-box';
    message.innerHTML = 'あたーっ';
    message.style.left = `${-53 + e.offsetX}px`;
    message.style.top = `${-42 + e.offsetY}px`;
    taskBody.appendChild(message);
    setTimeout(() => {
      taskBody.removeChild(message);
    }, 500);
  };

  #deadMessage = (e: MouseEvent): void => {
    const taskBody = e.target;
    if (!(taskBody instanceof HTMLElement)) return;
    taskBody.style;
    const message = document.createElement('div');
    message.className = 'message-box message-dead';
    message.innerHTML = '北斗百裂拳!<br>お前はもう死んでいる';
    message.style.left = `${-127 + e.offsetX}px`;
    message.style.top = `${-83 + e.offsetY}px`;
    taskBody.appendChild(message);
    setTimeout(() => {
      taskBody.removeChild(message);
    }, 1500);
  };
}
