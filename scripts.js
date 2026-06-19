const inputElement = document.querySelector(".new-task-input");
const addTaskButton = document.querySelector(".new-task-button");
const tasksContainer = document.querySelector(".tasks-container");



const validateInput = () => {
  return inputElement.value.trim().length > 0;
};

const handleInputChange = () => {
  const inputIsValid = validateInput();

  if (inputIsValid) {
    inputElement.classList.remove("error");
  }
};



const createTaskElement = (taskDescription, isCompleted = false) => {
  const taskItemContainer = document.createElement("div");
  taskItemContainer.classList.add("task-item");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isCompleted;

  const taskContent = document.createElement("p");
  taskContent.innerText = taskDescription;
  
  if (isCompleted) {
    taskContent.classList.add("completed");
  }



checkbox.addEventListener("change", () => {
    taskContent.classList.toggle("completed");
    updateLocalStorage();
  });

  taskContent.addEventListener("click", () => {
    handleTaskClick(taskContent);
  });

   taskContent.addEventListener("click", () => {
    taskContent.classList.toggle("completed");
    checkbox.checked = taskContent.classList.contains("completed");
    updateLocalStorage();
  });



  const editItem = document.createElement("i");
  editItem.classList.add("far", "fa-edit");

  editItem.addEventListener("click", () => {
    handleEditTask(taskContent);
  });

  const deleteItem = document.createElement("i");
  deleteItem.classList.add("far", "fa-trash-alt");

  deleteItem.addEventListener("click", () => {
    handleDeleteTask(taskItemContainer);
  });

  
   taskItemContainer.appendChild(checkbox);
   taskItemContainer.appendChild(taskContent);
   taskItemContainer.appendChild(editItem);
   taskItemContainer.appendChild(deleteItem);

  tasksContainer.appendChild(taskItemContainer);
};



const handleAddTask = () => {
  const inputIsValid = validateInput();

  if (!inputIsValid) {
    inputElement.classList.add("error");
    return;
  }

  createTaskElement(inputElement.value);

  inputElement.value = "";

  updateLocalStorage();
};

const handleTaskClick = (taskContent) => {
  taskContent.classList.toggle("completed");

  updateLocalStorage();
};

const handleDeleteTask = (taskItemContainer) => {
  taskItemContainer.remove();

  updateLocalStorage();
};



/* 
   save local das coisa
*/

const updateLocalStorage = () => {
  const tasks = tasksContainer.children;

  const localStorageTasks = [...tasks].map((task) => {
    const content = task.firstChild;

    return {
      description: content.innerText,
      isCompleted: content.classList.contains("completed"),
    };
  });

  localStorage.setItem("tasks", JSON.stringify(localStorageTasks));
};

const refreshTasksUsingLocalStorage = () => {
  const tasksFromLocalStorage = JSON.parse(
    localStorage.getItem("tasks")
  );

  if (!tasksFromLocalStorage) return;

  for (const task of tasksFromLocalStorage) {
    createTaskElement(task.description, task.isCompleted);
  }
};



/* 
   butao
*/

addTaskButton.addEventListener("click", () => {
  handleAddTask();
});

inputElement.addEventListener("input", () => {
  handleInputChange();
});

inputElement.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    handleAddTask();
  }
});

const handleEditTask = (taskContent) => {
  const newText = prompt("Editar tarefa:", taskContent.innerText);

  if (!newText || newText.trim().length === 0) return;

  taskContent.innerText = newText.trim();

  updateLocalStorage();
};



refreshTasksUsingLocalStorage();