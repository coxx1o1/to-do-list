const addbtn = document.getElementById("add");
const task = document.getElementById("tasklist");
const input = document.getElementById("input");
const summary = document.getElementById("task-summary");

// Load saved tasks from localStorage and build the task list
window.addEventListener("load", () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    const tasksArray = JSON.parse(savedTasks);
    tasksArray.forEach((taskObj) => {
      createTaskElement(taskObj.text, taskObj.completed);
    });
  }
  updateTaskSummary();
});

addbtn.addEventListener("click", () => {
  const taskText = input.value.trim();
  if (taskText !== "") {
    createTaskElement(taskText, false);
    saveTasks();
    updateTaskSummary();
    input.value = "";
  }
});

function createTaskElement(text, completed) {
  const li = document.createElement("li");
  li.classList.add("fade-in");

  let span = document.createElement("span");
  span.textContent = text;
  if (completed) {
    span.classList.add("completed");
  }

  // Toggle complete
  function toggleComplete(event) {
    event.target.classList.toggle("completed");
    saveTasks();
    updateTaskSummary();
  }
  span.addEventListener("click", toggleComplete);

  // Delete Button
  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.style.marginLeft = "10px";
  delBtn.addEventListener("click", () => {
    li.remove();
    saveTasks();
    updateTaskSummary();
  });

  // Edit Button
  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.style.marginLeft = "5px";

  function startEditing() {
    const inputEdit = document.createElement("input");
    inputEdit.type = "text";
    inputEdit.value = span.textContent;
    li.replaceChild(inputEdit, span);
    inputEdit.focus();

    // Disable edit button while editing
    editBtn.disabled = true;

    // Helper function to finish editing and update span
    function finishEditing(save) {
      if (save && inputEdit.value.trim() !== "") {
        const newSpan = document.createElement("span");
        newSpan.textContent = inputEdit.value;

        if (span.classList.contains("completed")) {
          newSpan.classList.add("completed");
        }

        newSpan.addEventListener("click", toggleComplete);

        li.replaceChild(newSpan, inputEdit);
        span = newSpan; // update reference
        saveTasks();
        updateTaskSummary();
      } else {
        // Cancel editing, revert back to old span
        li.replaceChild(span, inputEdit);
      }
      editBtn.disabled = false;
      cleanup();
    }

    // Clean up listeners
    function cleanup() {
      inputEdit.removeEventListener("keypress", onKeyPress);
      inputEdit.removeEventListener("blur", onBlur);
    }

    function onKeyPress(e) {
      if (e.key === "Enter") {
        finishEditing(true);
      } else if (e.key === "Escape") {
        finishEditing(false);
      }
    }

    function onBlur() {
      finishEditing(true);
    }

    inputEdit.addEventListener("keypress", onKeyPress);
    inputEdit.addEventListener("blur", onBlur);
  }

  editBtn.addEventListener("click", startEditing);

  li.appendChild(span);
  li.appendChild(editBtn);
  li.appendChild(delBtn);
  task.appendChild(li);
}

// Save tasks as an array of objects to localStorage
function saveTasks() {
  const tasksArray = [];
  task.querySelectorAll("li").forEach((li) => {
    const span = li.querySelector("span");
    tasksArray.push({
      text: span.textContent,
      completed: span.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasksArray));
}


