const addbtn = document.getElementById("add");
const task = document.getElementById("tasklist");
const input = document.getElementById("input");
const display= document.getElementById("display");



addbtn.addEventListener("click", () => {
  const taskText = input.value.trim();

  if (taskText !== "") {
    const li = document.createElement("li");
    li.textContent = taskText;

    // Optional: Add delete button to each task
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.style.marginLeft = "10px";
    delBtn.addEventListener("click", () => {
      task.removeChild(li);
    });

    li.appendChild(delBtn);
    task.appendChild(li);

    input.value = "";
  }
});
