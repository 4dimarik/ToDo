'use strict';

// const addBtn = document.querySelector('#add');
const todoControl = document.querySelector('form');
const todoContainer = document.querySelector('.todo-container');

const toDoData = [
  {
    text: 'Сварить кофе',
    completed: false,
  },
  {
    text: 'Помыть посуду',
    completed: true,
  },
];

const getCard = (header = '', quantity = 0, colorType = 'primary') => {
  const cardTemplate = document.querySelector('#cardTemplate');
  const card = cardTemplate.content.cloneNode(true);

  const cardHeader = card.querySelector('.card-header');
  cardHeader.classList.add(`text-${colorType}`);
  const quantityBadge = card.querySelector('.quantity');
  quantityBadge.classList.add(`bg-${colorType}`);

  cardHeader.prepend(header);
  quantityBadge.textContent = quantity;

  return card;
};

const getTodo = (text, todoCompleteColor = 'primary') => {
  const todoTemplate = document.querySelector('#todoTemplate');
  const todo = todoTemplate.content.cloneNode(true);

  const textTodo = todo.querySelector('.text-todo');
  const todoCompleteBtn = todo.querySelector('.todo-complete');
  todoCompleteBtn.classList.add(`text-${todoCompleteColor}`);
  textTodo.textContent = text;

  return todo;
};

const render = () => {
  todoContainer.innerHTML = '';
  const todoListData = toDoData.filter((item) => item.completed === false);
  let cardTodo = getCard('Текущие задачи', todoListData.length, 'info');

  cardTodo = todoListData.reduce((cardTodo, item) => {
    let todo = getTodo(item.text, 'dark');
    cardTodo.querySelector('.todo').append(todo);
    return cardTodo;
  }, cardTodo);
  todoContainer.append(cardTodo);
};

todoControl.addEventListener('submit', (event) => {
  event.preventDefault();
  let { target: form } = event;
  console.log(form.taskName.value);

  const newToDo = {
    text: form.taskName.value,
    completed: false,
  };

  toDoData.push(newToDo);
  form.taskName.value = '';
  form.taskName.focus();

  render();
});
