// import '@fortawesome/fontawesome-free';
import '@fortawesome/fontawesome-free/js/brands.js';
import '@fortawesome/fontawesome-free/js/regular.js';
import '@fortawesome/fontawesome-free/js/solid.js';
import '@fortawesome/fontawesome-free/js/fontawesome.js';
import './stylesheets/style.scss';
import { TabSwitcher } from 'multi-tab-switcher';
import { Todo } from './scripts/todo';

const todoElement = document.querySelector('.todo-component');
if (todoElement instanceof HTMLElement) {
  new TabSwitcher(todoElement);
  new Todo(todoElement);
}
