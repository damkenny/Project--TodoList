import { isSameISOWeek, parseISO, endOfWeek } from "../node_modules/date-fns";
const taskData = (() => {
  const getTasks = (sort) => {
    let todaysDate = new Date();
    let sunday = endOfWeek(todaysDate);
    switch (sort) {
      case "all":
        return JSON.parse(localStorage.getItem("tasks"));
      case "today":
        let todayList = JSON.parse(localStorage.getItem("tasks"));
        return todayList.filter(
          (task) => task.date == new Date().toISOString().slice(0, 10)
        );

      case "week":
        let weekList = JSON.parse(localStorage.getItem("tasks"));
        return weekList.filter((task) =>
          isSameISOWeek(parseISO(task.date), sunday)
        );
      case "important":
        let importantList = JSON.parse(localStorage.getItem("tasks"));
        return importantList.filter((task) => task.important == true);
      case "complete":
        let completedList = JSON.parse(localStorage.getItem("tasks"));
        return completedList.filter((task) => task.complete == true);
      default:
        return JSON.parse(localStorage.getItem("tasks")).filter(
          (task) => task.project == sort
        );
    }
  };
  //initialize local storage
  if (localStorage.getItem("idcount") == null) {
    localStorage.setItem("idcount", "0");
  }
  let idcount = +localStorage.getItem("idcount");
  const pushToLocal = (taskList) => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
  };
  const returnLocal = () => {
    if (JSON.parse(localStorage.getItem("tasks")) == null) {
      return [];
    }
    return JSON.parse(localStorage.getItem("tasks"));
  };
  const newTask = () => {
    let taskList = returnLocal();
    let today = new Date().toISOString().slice(0, 10);
    idcount += 1;
    localStorage.setItem("idcount", idcount);
    taskList.push({
      title: "untitled",
      id: idcount,
      date: today,
      description: "Add description here",
      important: false,
      complete: false,
      project: "Add to a project",
      subtasks: [],
    });
    pushToLocal(taskList);
  };

  const deleteTask = (dataset) => {
    let taskListDeleted = returnLocal();
    taskListDeleted = taskListDeleted.filter((task) => task.id != dataset);
    pushToLocal(taskListDeleted);
  };
  const addTitle = (dataset, newTitle) => {
    let arrTitle = returnLocal();
    let titleTarget = arrTitle.filter((task) => task.id == dataset);
    arrTitle[arrTitle.indexOf(titleTarget[0])].title = newTitle;
    pushToLocal(arrTitle);
  };

  const addDate = (dataset, newDate) => {
    let arrDate = returnLocal();
    let dateTarget = arrDate.filter((task) => task.id == dataset);
    arrDate[arrDate.indexOf(dateTarget[0])].date = newDate;
    pushToLocal(arrDate);
  };
  const addDesc = (dataset, newDesc) => {
    let arrDesc = returnLocal();

    let descTarget = arrDesc.filter((task) => task.id == dataset);
    arrDesc[arrDesc.indexOf(descTarget[0])].description = newDesc;

    pushToLocal(arrDesc);
  };
  const addProject = (dataset, newProject) => {
    let arrProj = returnLocal();
    let projTarget = arrProj.filter((task) => task.id == dataset);
    arrProj[arrProj.indexOf(projTarget[0])].project = newProject;
    pushToLocal(arrProj);
  };

  const toggleImportant = (dataset) => {
    let arrImp = returnLocal();
    let importantTarget = arrImp.filter((task) => task.id == dataset);
    let importantIndex = arrImp.indexOf(importantTarget[0]);
    if (arrImp[importantIndex].important === true) {
      arrImp[importantIndex].important = false;
    } else {
      arrImp[importantIndex].important = true;
    }
    pushToLocal(arrImp);
  };

  const toggleComplete = (dataset) => {
    let taskList = returnLocal();
    let completeTarget = taskList.filter((task) => task.id == dataset);
    let completeIndex = taskList.indexOf(completeTarget[0]);
    if (taskList[completeIndex].complete === true) {
      taskList[completeIndex].complete = false;
    } else {
      taskList[completeIndex].complete = true;
    }
    pushToLocal(taskList);
  };

  const newSubTask = (dataset) => {
    let taskListSub = returnLocal();
    let subTarget = taskListSub.filter((task) => task.id == dataset);
    let subTaskCount =
      taskListSub[taskListSub.indexOf(subTarget[0])].subtasks.length;
    taskListSub[taskListSub.indexOf(subTarget[0])].subtasks.push(
      `sbtasuk ${subTaskCount}`
    );
    pushToLocal(taskListSub);
  };
  const delSubtask = (dataset, subtask) => {
    let taskListDel = returnLocal();
    let targetTask = taskListDel.filter((task) => task.id == dataset);
    taskListDel[taskListDel.indexOf(targetTask[0])].subtasks = taskListDel[
      taskListDel.indexOf(targetTask[0])
    ].subtasks.filter((task) => task !== subtask);
    pushToLocal(taskListDel);
  };

  const editSubtask = (dataset, oldtask, newtask) => {
    let taskList = returnLocal();
    let targetTask = taskList.filter((task) => task.id == dataset);
    let targetSubtask = taskList[
      taskList.indexOf(targetTask[0])
    ].subtasks.indexOf(oldtask);
    taskList[taskList.indexOf(targetTask[0])].subtasks[targetSubtask] = newtask;
    pushToLocal(taskList);
  };

  return {
    addTitle,
    newTask,
    deleteTask,
    getTasks,
    addDate,
    addDesc,
    addProject,
    toggleComplete,
    toggleImportant,
    pushToLocal,
    returnLocal,
    newSubTask,
    delSubtask,
    editSubtask,
  };
})();

const projectData = (() => {
  const getProjects = () => {
    if (!localStorage.getItem("projects")) {
      localStorage.setItem("projects", "[]");
    }
    let projectList = JSON.parse(localStorage.getItem("projects"));
    return projectList;
  };
  const addProject = () => {
    let projectList = JSON.parse(localStorage.getItem("projects"));
    projectList.push(`new project ${projectList.length + 1}`);
    localStorage.setItem("projects", JSON.stringify(projectList));
  };

  const deleteProject = (projectName) => {
    let deleteList = JSON.parse(localStorage.getItem("projects"));
    deleteList = deleteList.filter((elem) => elem !== projectName);
    localStorage.setItem("projects", JSON.stringify(deleteList));
  };
  const renameProject = (oldName, newName) => {
    let renameList = JSON.parse(localStorage.getItem("projects"));
    let renameIndex = renameList.indexOf(oldName);
    renameList[renameIndex] = newName;
    localStorage.setItem("projects", JSON.stringify(renameList));
  };

  return {
    getProjects,
    addProject,
    deleteProject,
    renameProject,
  };
})();

export { taskData, projectData };