// TASK: import helper functions from utils
// TASK: import initialData
import { getTasks, saveTasks, createNewTask, patchTask, putTask, deleteTask } from "./utils/taskFunctions.js";
import { initialData } from "./initialData.js";
/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(initialData)); 
    localStorage.setItem('showSideBar', 'true')
  } else {
    console.log('Data already exists in localStorage');
  }
}
initializeData();

function renderTasks() {
  const tasks = getTasks();
  const todoContainer = document.querySelector('[data-status="todo"] .tasks-container');
  const doingContainer = document.querySelector('data-status="doing" .tasks-container');
  const doneContainer = document.querySelector('[data-status="done"] .tasks-container');
  todoContainer.innerHTML = '';
  doingContainer.innerHTML = '';
  doneContainer.innerHTML = '';
  tasks.forEach(task => {
    const taskDiv = document.createElement('div')
    taskDiv.innerHTML = `
      <h5>${task.title}</h5>
      <p>${task.description}</p>
    `;
  taskDiv.setAttribute('data-task-id', task.id);
  // Handle click to open modal
  task.Div.addEventlistener('click', () => openEditTaskModal(task));
  switch (task.status) {
    case 'done':
        doneContainer.appendChild(taskDiv);
        break;
    case 'doing':
        doingContainer.appendChild(taskDiv);
        break;
    case 'todo':
    default:
        todoContainer.appendChild(taskDiv);
        break;
    }
  });
};
renderTasks();

// TASK: Get elements from the DOM
const elements = {
  columnDivs: document.querySelectorAll(".column-div"),
  boardsContainer: document.getElementById("boards-nav-links-div"),
  headerBoardName: document.querySelector(".header-board-name"),
  cancelEditBtn: document.getElementById("cancel-edit-btn"),
  cancelAddTaskBtn: document.getElementById("cancel-add-task-btn"),
  filterDiv: document.getElementById("filter-div"),
  hideSidebarBtn: document.getElementById("hide-sidebar-btn"),
  showSidebarBtn: document.getElementById("show-sidebar-btn"),
  themeSwitch: document.getElementById("theme-switch"),
  createNewTaskBtn: document.getElementById("create-new-task-btn"),
  addTaskForm: document.getElementById("add-task-form"),
  editTaskTitle: document.getElementById("edit-task-title"),
  editTaskDesc: document.getElementById("edit-task-desc"),
  editTaskStatus: document.getElementById("edit-task-status"),
  saveTaskBtn: document.getElementById("save-task-btn"),
  deleteTaskBtn: document.getElementById("delete-task-btn"),
  taskModal: document.getElementById("task-modal"),
  editTaskModal: document.getElementById("edit-task-modal"),
  sidebarDiv: document.querySelector(".sidebar-div"),
  showSidebarDiv: document.querySelector(".show-sidebar-div"),
  body: document.body

}

let activeBoard = ""

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"))
    activeBoard = localStorageBoard ? localStorageBoard ;  boards[0]; 
    elements.headerBoardName.textContent = activeBoard
    styleActiveBoard(activeBoard)
    refreshTasksUI();
  }
}

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ''; // Clears the container
  boards.forEach(board => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.click()  { 
      boardElement.addEventListener('click', () => {
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board //assigns active board
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard))
      styleActiveBoard(activeBoard)
    };
    boardsContainer.appendChild(boardElement);
  });

}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter(task => task.board === boardName);

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach(column => {
    const status = column.getAttribute("data-status");
    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    column.appendChild(tasksContainer);

    filteredTasks.filter(task => task.status = status).forEach(task => { 
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute('data-task-id', task.id);

      // Listen for a click event on each task and open a modal
      taskElement.addEventListener ('click', () => {
        openEditTaskModal(task);
      });

      tasksContainer.appendChild(taskElement);
    });
  });
}


function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll(".board-btn").forEach(btn => {
    
    if(btn.textContent === boardName) {
     btn.classList.add('active')
    }
    else {
     btn.classList.remove('active');
    }
  });
}


function addTaskToUI(task) {
  const column = document.querySelector('.column-div[data-status="${task.status}"]'); 
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector('.tasks-container');
  if (!tasksContainer) {
    console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
    tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks-container';
    column.appendChild(tasksContainer);
  }

const taskElement = document.createElement("div");
  taskElement.classList.add = "task-div";
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute('data-task-id', task.id);
  
  tasksContainer.appendChild(); 
}



function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  cancelEditBtn.click() => toggleModal(false, elements.editTaskModal));

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById('cancel-add-task-btn');
  cancelAddTaskBtn.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Show sidebar event listener
  elements.hideSideBarBtn.click() => toggleSidebar(false));
  elements.showSideBarBtn.click() => toggleSidebar(true));

  // Theme switch event listener
  elements.themeSwitch.addEventListener('change', toggleTheme);

  // Show Add New Task Modal event listener
  elements.createNewTaskBtn.addEventListener('click', () => {
    toggleModal(true);
    elements.filterDiv.style.display = 'block'; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener('submit',  (event) => {
    addTask(event)
  });
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? 'block' => 'none'; 
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

async function addTask(event) {
  event.preventDefault(); 

  //Assign user input to the task object
    const task = {
    title: document.getElementById("task-title").value,
    description: document.getElementById("task-desc").value,
    status: document.getElementById("task-status").value,
    board: activeBoard,
    id: Date.now()
  };

  try {
    const newTask = await createNewTask(task); // Await the promise
    if (newTask) {
      addTaskToUI(newTask);
      toggleModal(false);
      elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
      event.target.reset();
      refreshTasksUI();
    }
}
 catch (error) {
    console.error("Failed to add task:", error);
  }
}
//Toggle sidebar visibility
function toggleSidebar(show) {
  if (show) {
    elements.sidebarDiv.style.display = 'block'; // Show the sidebar
    elements.showSidebarDiv.style.display = 'none'; // Hide the show sidebar button
    elements.hideSideBarBtn.style.display = 'block'; // Show the hide sidebar button
  } else {
    elements.sidebarDiv.style.display = 'none'; // Hide the sidebar
    elements.showSidebarDiv.style.display = 'block'; // Show the show sidebar button
    elements.hideSideBarBtn.style.display = 'none'; // Hide the hide sidebar button
  }

}
//Toggle between light and dark theme
function toggleTheme() {
 const currentTheme = elements.body.classList.contains('dark-theme');
  if (currentTheme) {
    elements.body.classList.remove('dark-theme'); // Remove dark theme
    elements.body.classList.add('light-theme'); // Add light theme
  } else {
    elements.body.classList.remove('light-theme'); // Remove light theme
    elements.body.classList.add('dark-theme'); // Add dark theme
  }
}


async function openEditTaskModal(task) {
  // Set task details in modal inputs
   elements.editTaskTitle.value = task.title;
  elements.editTaskDesc.value = task.description;
  elements.editTaskStatus.value = task.status;

  // Get button elements from the task modal
 elements.saveTaskBtn.onclick = async () => {
    await saveTaskChanges(task.id);
  };
  // Call saveTaskChanges upon click of Save Changes button
 

  // Delete task using a helper function and close the task modal
   elements.deleteTaskBtn.onclick = async () => {
    await handleDeleteTask(task.id);
  };

  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}

function saveTaskChanges(taskId) {
  // Get new user inputs
  

  // Create an object with the updated task details
 const updatedTask = {
    id: taskId,
    title: elements.editTaskTitle.value,
    description: elements.editTaskDesc.value,
    status: elements.editTaskStatus.value,
    board: activeBoard
  };

  // Update task using a hlper functoin
  patchTask(taskId, updatedTask);
 

  // Close the modal and refresh the UI to reflect the changes
 toggleModal(false, elements.editTaskModal);
  refreshTasksUI();
}

/*************************************************************************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  init(); // init is called after the DOM is fully loaded
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}