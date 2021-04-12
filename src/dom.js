import { taskData, projectData } from "./data";
import { compareAsc, parseISO } from "../node_modules/date-fns";
const render = (() => {
  const icon = {
    plus: `<i class="fas fa-plus"></i>`,
    minus: `<i class="fas fa-minus"></i>`,
    subMinus: `<i class="fas fa-minus sub"></i>`,
    check: `<i class="fas fa-check">`,
    exclaim: `<i class="fas fa-exclamation"></i>`,
    bars: `<i class="fas fa-bars"></i>`,
    edit: `<i class="far fa-edit"></i>`,
  };

  const title = () => {
    const titleBar = document.createElement("div");
    titleBar.classList.add("titlebar");
    container.appendChild(titleBar);
    const waterDrop = document.createElement("div");
    waterDrop.classList.add("waterDrop");
    waterDrop.innerHTML = icon.bars;
    titleBar.appendChild(waterDrop);
    const _title = document.createElement("div");
    _title.innerHTML = `<h1>Taske</h1>`;
    titleBar.appendChild(_title);
  };

  const menuItem = ({ label, dataset }) => ({
    label,
    dataset,
  });

  const defaultMenuItems = [
    menuItem({ label: icon.plus + ` Add Project`, dataset: "add" }),
    menuItem({ label: "All Projects", dataset: "all" }),
    menuItem({ label: "Today", dataset: "today" }),
    menuItem({ label: "This Week", dataset: "week" }),
    menuItem({ label: "Important", dataset: "important" }),
    menuItem({ label: "Completed", dataset: "complete" }),
    menuItem({ label: icon.plus + " Add New Task", dataset: "newTask" }),
  ];

  const menu = (dataset) => {
    const _menu = document.querySelector(".menu");
    _menu.innerHTML = "";
    let projects = projectData.getProjects();

    if (projects.length) {
      for (let i = 0; i < projects.length; i++) {
        let project = document.createElement("div");
        project.classList.add("menuItem");
        project.setAttribute("data-menu", `${projects[i]}`);
        project.innerHTML = icon.minus + " " + icon.edit + " " + projects[i];

        _menu.appendChild(project);
      }
    }
    for (let i = 0; i < defaultMenuItems.length; i++) {
      let newMenuItem = document.createElement("div");
      newMenuItem.classList.add("menuItem");
      newMenuItem.setAttribute(`data-menu`, `${defaultMenuItems[i].dataset}`);
      newMenuItem.innerHTML = defaultMenuItems[i].label;
      _menu.appendChild(newMenuItem);
    }
    menuSelection(dataset);
  };
  let selectedMenuItem = "all";
  const getSelectedMenuItem = () => {
    return selectedMenuItem;
  };

  const menuSelection = (dataset) => {
    selectedMenuItem = dataset;
    const _menuItem = Array.from(document.querySelectorAll(".menuItem"));
    _menuItem.forEach((sel) => sel.classList.remove("selected"));
    let selected = document.querySelector(`[data-menu="${selectedMenuItem}"]`);
    selected.classList.add("selected");
  };

  const drawCards = () => {
    let tasks = document.querySelector(".contentArea");
    tasks.innerHTML = 
    `Press the <i class="fas fa-bars rotate"></i> button to begin`;
    let taskList = taskData.getTasks(selectedMenuItem);
    
    if (taskData.getTasks(selectedMenuItem) !== null) {
      tasks.innerHTML = ""
      for (let i = 0; i < taskList.length; i++) {
        let task = document.createElement("div");
        task.classList.add("task");
        tasks.appendChild(task);
        let taskTitle = document.createElement("div");
        taskTitle.classList.add("taskTitle");
        task.appendChild(taskTitle);
        let taskName = document.createElement("div");
        taskName.classList.add("taskName");
        taskName.setAttribute("data-task", `${taskList[i].id}`);
        taskName.innerHTML = `${icon.minus}
          <input type="text" data-task="${taskList[i].id}" class="taskNameInput" 
          value="${taskList[i].title}">`;
        taskTitle.appendChild(taskName);
        let taskProject = document.createElement("div");
        taskProject.classList.add("taskProject");
        taskProject.setAttribute("data-task", `${taskList[i].id}`);
        taskProject.innerText = taskList[i].project;
        taskTitle.appendChild(taskProject);
        let taskDate = document.createElement("div");
        taskDate.classList.add("taskDate");
        taskDate.setAttribute("data-task", `${taskList[i].id}`);
        taskDate.innerHTML = `<input type="date" class="taskDate" data-task="${taskList[i].id}" value="${taskList[i].date}">`; //gettaskdate
        let taskDateInput = taskDate.querySelector(".taskDate");
        if (
          compareAsc(
            parseISO(taskList[i].date),
            parseISO(new Date().toISOString().slice(0, 10))
          ) < 0
        ) {
          taskDateInput.style.color = "red";
        }
        taskTitle.appendChild(taskDate); 

        let taskDesc = document.createElement("div");
        taskDesc.classList.add("taskDesc");
        taskDesc.setAttribute("data-task", `${taskList[i].id}`);
        taskDesc.innerHTML =
          `<input type="text" data-task="${taskList[i].id}"` +
          `class="description" value="${taskList[i].description}">`;
        task.appendChild(taskDesc);

        let subTasks = document.createElement("div");
        subTasks.classList.add("subTasks");
        task.appendChild(subTasks);
        if (!taskList[i].subTasks) {
          for (let j = 0; j < taskList[i].subtasks.length; j++) {
            let subtask = document.createElement("div");
            subtask.setAttribute("data-task", `${taskList[i].id}`);
            subtask.innerHTML =
              icon.subMinus +
              `<input type="text" class="subtask" value="${taskList[i].subtasks[j]}">`;
            subTasks.appendChild(subtask);
          }
        }
        let newSubtask = document.createElement("div");
        newSubtask.classList.add("newSubtask");
        newSubtask.id = "newSubtask";
        newSubtask.setAttribute("data-task", `${taskList[i].id}`);
        newSubtask.innerHTML = icon.plus + ` New subtask`;
        subTasks.appendChild(newSubtask);
        let taskFooter = document.createElement("div");
        taskFooter.classList.add("taskFooter");
        if (taskList[i].complete == true) {
          taskFooter.style.backgroundColor = "green";
          taskFooter.style.color = "white";
        }
        task.appendChild(taskFooter);
        let taskComplete = document.createElement("div");
        taskComplete.classList.add("taskComplete");
        taskComplete.innerHTML = `<i class="fas fa-check"></i> Task Complete`; //get
        taskComplete.setAttribute("data-task", `${taskList[i].id}`);
        taskFooter.appendChild(taskComplete);
        let taskImportant = document.createElement("div");
        taskImportant.classList.add("taskImportant");
        taskImportant.setAttribute("data-task", `${taskList[i].id}`);
        taskImportant.innerHTML = icon.exclaim;
        if (taskList[i].important == true) {
          taskImportant.style.backgroundColor = "red";
        }
        taskFooter.appendChild(taskImportant);
      }
    }
  };

  const projectMenu = (id) => {
    let targetTask = document.querySelector(`.taskProject[data-task="${id}"]`);
    let dropMenu = document.createElement("div");
    dropMenu.classList.add("dropMenu");
    targetTask.appendChild(dropMenu);
    let projects = projectData.getProjects();
    for (let i = 0; i < projects.length; i++) {
      let proj = document.createElement("div");
      proj.classList.add("projMenuItem");
      proj.setAttribute("data-proj", id);
      proj.innerHTML = projects[i];
      dropMenu.appendChild(proj);
    }
    let clearProject = document.createElement("div");
    clearProject.classList.add("projMenuItem", "clearProject");
    clearProject.setAttribute("data-proj", id);
    clearProject.innerHTML = icon.minus + " Clear Project";
    dropMenu.appendChild(clearProject);
  };

  const base = () => {
    const container = document.querySelector("#container");
    
    title();
    const _menu = document.createElement("div");
    _menu.classList.add("menu");
    _menu.style.visibility = "hidden";
    container.appendChild(_menu);
    menu("all");
    const _tasks = document.createElement("div");
    _tasks.classList.add("contentArea");
    _tasks.innerHTML = 
      
    container.appendChild(_tasks);
    drawCards();
  };

  return {
    base,
    menu,
    drawCards,
    getSelectedMenuItem,
    projectMenu,
    menuSelection,
  };
})();

export default render;