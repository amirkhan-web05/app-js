const todoInput = document.querySelector('#todoInput');
const todoList = document.querySelector('#todoList');
const btnTodo = document.querySelector('#btnTodo');

let todos = [];

const renderTodo = ({ id, title, completed }) => {
   const li = document.createElement('li');
   li.classList.add('todo__item');
   li.id = id;

   li.innerHTML = `
      <span data-id='completed' class='${
         completed ? 'todo__title todo-title--completed' : 'todo__title'
      }'>
         ${title}
      </span>
      <button data-id='remove'>Remove</button>
   `;

   todoList.append(li);
};

todos.forEach((todo) => fetchTodo(todo));

const addTodo = () => {
   const title = todoInput.value;

   if (todoInput.value.trim() === '') return;

   const newTodo = {
      id: Date.now(),
      title,
      completed: false,
   };

   renderTodo(newTodo);

   todos = [...todos, newTodo];

   todoInput.value = '';
};

const removeTodo = (event) => {
   if (event.target.dataset.id === 'remove') {
      const parentNode = event.target.closest('.todo__item');
      const id = Number(parentNode.id);

      todos.filter((todo) => todo.id !== id);

      parentNode.remove();
   }
};

const checkTodo = (event) => {
   if (event.target.dataset.id === 'completed') {
      const parentNode = event.target.closest('.todo__item');
      const id = Number(parentNode.id);

      todos.map((todo) =>
         todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );

      const todoTitle = parentNode.querySelector('.todo__title');
      todoTitle.classList.toggle('todo-title--completed');
   }
};

btnTodo.addEventListener('click', addTodo);
todoList.addEventListener('click', removeTodo);
todoList.addEventListener('click', checkTodo);
