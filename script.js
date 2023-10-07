const taskInput = document.querySelector(".taskInput input");
filters = document.querySelectorAll(".filters span");
const taskbox = document.querySelector(".task-box")
const CleaAll = document.querySelector(" .clear-button")


let EditId;
let isEditedTask = false;

//Getting local storage for  todo list
let todos = JSON.parse(localStorage.getItem("Todo-list")) || [];

var currentFIlter = "all";
// var currentFIlter = "pending";
// var currentFIlter = "completed";
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        const activeSpan = document.querySelector("span.active");
        if (activeSpan) {
            activeSpan.classList.remove("active");
        }
        btn.classList.add("active");

        currentFIlter = btn.id;
        showTodo(btn.id);
    });
})

function showTodo(filters) {
    let li = "";
    if (todos) {

        taskbox.innerHTML = "";
        todos.forEach((todo, id) => {
            // if todo status is completed, set the iscompleted value to checked
            let iscompleted = todo.status == "completed" ? "checked" : "";

            if (currentFIlter === "all" || currentFIlter === todo.status) {


                li += ` <li class="task">
                    <label for="${id}">
                      <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${iscompleted} />
                      <p class="${iscompleted}">${todo.name}</p>
                    </label>
                    <div class="settings">
                      <img onclick="showMenu(this)" class="dot" src="icons8-dots-loading-48.png" alt="" />
                      <ul class="task-menu" >
                        <li onclick="editTask(${id},'${todo.name}')" ><img src="9055458_bxs_edit_alt_icon.png" alt="">Edit</li>
                        <li onclick="deleteTask(${id})" ><img src="delete.png" alt="">delete</li>
                      </ul>
                    </div>
                  </li>`
            }
        });
    }
    taskbox.innerHTML = li || `<span>You don't have any task here 😁</span>`
}
function editTask(taskId, taskName) {
    EditId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;

}
function deleteTask(deleteId) {
    // removing selected task from array/todos
    todos.splice(deleteId, 1)
    localStorage.setItem("Todo-list", JSON.stringify(todos));
    showTodo();

}
CleaAll.addEventListener("click", () => {
    todos.splice(0,todos.length)
    localStorage.setItem("Todo-list", JSON.stringify(todos));
    showTodo();

})
function showMenu(selectedTask) {
    // getting task new menu div
    let taskmenu = selectedTask.parentElement.lastElementChild;
    taskmenu.classList.add("show")
    document.addEventListener("click", e => {
        // removing show class from the taskmenu on the document click
        if (e.target.tagName !== "I" && !selectedTask.contains(e.target))
        // if(e.target.tagName !="I" || e.target != selectedTask)
        {
            taskmenu.classList.remove("show");
        }
    })
}
showTodo();
function updateStatus(selectedTask) {
    // getting paragraph  that contains  task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    }
    else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";

    }
    localStorage.setItem("Todo-list", JSON.stringify(todos));

}
// updateStatus();
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key === "Enter" && userTask) {
        if (!isEditedTask) { // if isEditedTask isn't true
            if (!todos) {// if todos isn't  exist pass am empty array  to todos
                todos = [];
            }
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo); // adding new task  to todos

        }
        else {
            isEditedTask = false;
            todos[EditId].name = userTask;
        }
        localStorage.setItem("Todo-list", JSON.stringify(todos));
        showTodo();
    }
})