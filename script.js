'use strict';

const todoControl = document.querySelector('form');
const todoContainer = document.querySelector('.todo-container');

const storage = {
  name: null,
  isExist: function () {
    return !!localStorage.getItem(this.name);
  },
  get: function () {
    return JSON.parse(localStorage.getItem(this.name));
  },
  set: function (data) {
    localStorage.setItem(this.name, JSON.stringify(data));
  },
  add: function (item) {
    this.set([...this.get(), item]);
  },
  remove: function (id) {
    this.set(this.get().filter((item) => item.id !== id));
  },
  changeStatus: function (id) {
    console.log('changeStatus', id);
    this.set([
      ...this.get().map((item) => {
        if (item.id === id) {
          item = { ...item, completed: !item.completed };
        }
        return item;
      }),
    ]);
  },
};
const toDoData = { ...storage, name: 'toDoData' };

if (!toDoData.isExist()) toDoData.set([]);

const getCard = (id, header = '', quantity = 0, colorType = 'primary') => {
  const cardTemplate = document.querySelector('#cardTemplate');
  const card = cardTemplate.content.cloneNode(true);
  card.querySelector('.card').id = id;

  const cardHeader = card.querySelector('.card-header');
  cardHeader.classList.add(`text-${colorType}`);
  const quantityBadge = card.querySelector('.quantity');
  quantityBadge.classList.add(`bg-${colorType}`);

  cardHeader.prepend(header);
  quantityBadge.textContent = quantity;

  return card;
};

const getTodo = (id, text, todoCompleteColor = 'primary') => {
  const todoTemplate = document.querySelector('#todoTemplate');
  const todo = todoTemplate.content.cloneNode(true);

  const todoItem = todo.querySelector('.todo-item');
  todoItem.dataset.id = id;

  const textTodo = todo.querySelector('.text-todo');
  const todoCompleteBtn = todo.querySelector('.todo-complete');
  todoCompleteBtn.classList.add(`text-${todoCompleteColor}`);
  textTodo.textContent = text;

  return todo;
};

const render = () => {
  todoContainer.innerHTML = '';

  const todoListData = toDoData.get().filter((item) => item.completed === false);
  if (todoListData.length > 0) {
    let cardTodo = getCard('todo', 'Текущие задачи', todoListData.length, 'info');

    cardTodo = todoListData.reduce((cardTodo, item) => {
      let todo = getTodo(item.id, item.text, 'dark');
      cardTodo.querySelector('.todo').append(todo);
      return cardTodo;
    }, cardTodo);
    todoContainer.append(cardTodo);
  }

  const completedListData = toDoData.get().filter((item) => item.completed === true);
  if (completedListData.length > 0) {
    let cardCompleted = getCard(
      'completed',
      'Завершенные задачи',
      completedListData.length,
      'success'
    );

    cardCompleted = completedListData.reduce((cardCompleted, item) => {
      let completed = getTodo(item.id, item.text, 'success');
      cardCompleted.querySelector('.todo').append(completed);
      return cardCompleted;
    }, cardCompleted);
    todoContainer.append(cardCompleted);
  }
};
render();

todoContainer.addEventListener('click', (event) => {
  const element = event.target;
  if (element.closest('.todo-remove')) {
    const id = event.target.closest('.todo-item').dataset.id;
    toDoData.remove(id);
    render();
  }
  if (element.closest('.todo-complete')) {
    const id = event.target.closest('.todo-item').dataset.id;
    console.log(id);
    toDoData.changeStatus(id);
    render();
  }
});

todoControl.taskName.addEventListener('input', (event) => {
  const { target: inputTaskName } = event;
  if (inputTaskName.value.trim() === '') {
    inputTaskName.setCustomValidity('Поле не должно быть пустым');
  } else {
    inputTaskName.setCustomValidity('');
  }
  console.log(inputTaskName.checkValidity());
});
todoControl.addEventListener('submit', (event) => {
  event.preventDefault();
  let { target: form } = event;

  if (form.taskName.checkValidity()) {
    const newToDo = {
      text: form.taskName.value,
      completed: false,
      id: String(Date.now() + (Math.floor(Math.random() * (1000 - 1 + 1)) + 1)),
    };

    toDoData.add(newToDo);
    form.taskName.value = '';
    form.taskName.focus();
    render();
  }
});
