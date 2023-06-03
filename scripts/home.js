const TASKS = [
    [],[],[],[],[]
];

let isCurrentlyUpdating = false;
let isDescending = true;
let taskLocation = {
    priority: -1,
    index: -1
}
const NEW_NAME_ID = "updateNameId";
const NEW_PRI_ID = "updatePriorityId";
const ARROW_DOWN = "fa-sharp fa-solid fa-caret-down";
const ARROW_UP = "fa-solid fa-caret-up";
/**Builders ***************************************************/

function buildTasks(){
    let tableBody = document.getElementById("tableBody");
    tableBody.innerHTML="";
    let task = document.createElement("tr");
    task.setAttribute("class", "mt-1");
    let counter = 1;
    let priority = TASKS.length - 1;
    for(let i = 0; i < TASKS.length; i++){
      //  debugger;
        priority = isDescending? i: priority - i;
        if(TASKS[priority].length == 0) { priority = TASKS.length - 1; continue;}
        for(let index = 0 ; index < TASKS[priority].length; index++){
            task.appendChild(buildTableDetail(counter));
            task.appendChild(buildTaskName(priority, index));
            task.appendChild(buildPriority(priority, index));
            task.appendChild(buildActions(priority, index));
            tableBody.append(task);
            task = document.createElement("tr");
            counter++;
        }
        if(!isDescending) priority = TASKS.length - 1;
    }
}

function buildTableDetail(content){
    let td = document.createElement("td");
    td.setAttribute("class", "text-center");
    if(content instanceof Element) td.appendChild(content);
    else td.innerHTML = content;

    return td;
}

function buildPriority(priority, index){
    if(!isCurrentlyUpdatingThisTask(priority, index)) return buildTableDetail(getPriority(priority));

    let selectPri = document.createElement("select");
    selectPri.setAttribute("class", "form-select");
    selectPri.setAttribute("id", NEW_PRI_ID);
    let option;
    for(let i = 0; i< TASKS.length ; i++){
        option = document.createElement("option");
        option.setAttribute("value", `${i}`);
        option.innerHTML = getPriority(i);
        selectPri.appendChild(option);
    }
    selectPri.selectedIndex = priority;
    return buildTableDetail(selectPri);
}

function buildTaskName(priority, index){
    if(!isCurrentlyUpdatingThisTask(priority, index)) 
        return buildTableDetail(TASKS[priority][index]);
    return buildTextField(TASKS[priority][index], NEW_NAME_ID, "New Name Here");
}

function buildTextField(taskName, id, placeHolder, type = "text"){
   
    let textField = document.createElement("input");
    textField.setAttribute("id", id);
    textField.setAttribute("class", "form-control text-center");
    textField.setAttribute("type", type);
    textField.setAttribute("placeholder", placeHolder);
    textField.value = taskName;
    return buildTableDetail(textField, true);
}
function buildActions(priority, index){
    let td = document.createElement("td");
    td.setAttribute("class", "text-center");
    td.appendChild(buildActionsButtons(priority, index));
    return td;
}

function buildUpdateButtons(){

}

function buildActionsButtons(priority, index){
    let buttonsGroup = document.createElement("div");
    let negativeButton = buildButton(
        "btn-outline-danger", null, 
        "fa-regular fa-trash-can", `removeTask(${priority}, ${index})`
        );
    let positiveButton = buildButton(
        "btn-outline-primary", null,
        "fa-regular fa-pen-to-square", `updateTask(${priority}, ${index})`
    );

    if(isCurrentlyUpdatingThisTask(priority, index)){
        negativeButton = buildButton(
            "btn-outline-danger", null, 
            "fa-solid fa-xmark", `cancelUpdate()`
            );
        positiveButton = buildButton(
            "btn-outline-primary",null,
            "fa-regular fa-floppy-disk", `saveChanges()`
        );
    }

    buttonsGroup.appendChild(positiveButton);
    buttonsGroup.appendChild(negativeButton);
    buttonsGroup.setAttribute("class", "btn-group");
    return buttonsGroup;
}

function buildButton(buttonShapeColor, specialClass, buttonIcon, callBack){
    let button = document.createElement("button");
    button.setAttribute("class", `btn ${buttonShapeColor} pt-1 pb-1 ${specialClass || ""}`);
    let icon = document.createElement('i');
    icon.setAttribute('class', buttonIcon);
    icon.style.fontSize= "1.2rem";
    button.appendChild(icon);
    button.setAttribute("onclick", callBack);
    return button;
}

/**Operations ******************************************************/
function isCurrentlyUpdatingThisTask(priority, index){
    if(!isCurrentlyUpdating) 
        return false;
    if(taskLocation.priority === -1 || taskLocation.index ===-1) 
        return false;
    if(taskLocation.priority === priority && taskLocation.index === index)
        return true;
    return false;
}
function addTask(){
    let inserionIndex = Number(document.getElementById("taskPriority").value);
    validate(null, "taskPriority", "Please Select Valid Priority");
    let taskName = document.getElementById("taskName").value;
    if(!validate(taskName, "taskName")) return;
    document.getElementById("taskName").value = "";
    TASKS[inserionIndex].push(taskName);
    buildTasks();
}

function validate(text, formId, message){
    const ERROR = document.getElementById("error");
    if(text && !text.match(/^ *$/)) {
        ERROR.style.display = 'none';
        return true;
    }
    ERROR.style.display = "block";
    ERROR.innerHTML = message || "Please Enter a valid task name";
    ERROR.htmlFor = formId;

    return false;
}

function removeTask(priority, index){
    let message = `Are you sure you want to delete the task ${TASKS[priority][index]}?`;
    if(confirm(message)){
        TASKS[priority].splice(index, 1);
        buildTasks();
    }
}

function updateTask(priority, index){
    if(isCurrentlyUpdating) return;
    isCurrentlyUpdating=true;
    taskLocation.priority = priority;
    taskLocation.index = index;
    buildTasks();
}

function cancelUpdate(){
    isCurrentlyUpdating=false;
    taskLocation.priority = -1;
    taskLocation.index = -1;
    buildTasks();
}

function saveChanges(){
    let newName = document.getElementById(NEW_NAME_ID).value;
    if(!validate(newName, NEW_NAME_ID)) return;
    isCurrentlyUpdating = false;
    let priority = Number(document.getElementById(NEW_PRI_ID).value);
    if(priority == taskLocation.priority && newName == TASKS[priority][taskLocation.index]) return;
    TASKS[taskLocation.priority].splice(taskLocation.index, 1);
    TASKS[priority].push(newName);
    buildTasks();
}

function getHighestPriorityTask(){
    for(let priority = 0; priority < TASKS.length; priority++){
        if(TASKS[priority].length == 0) continue;
        alert(`The Highest Priority task is ${TASKS[priority][0]} `);
        break;
    }
} 

function getPriority(index){
    if(index == 0) return "Very High";
    if(index == 1) return "High";
    if(index == 2) return "Medium";
    if(index == 3) return "Low";
    if(index == 4) return "Very Low"
    else return "-";
}

function sortTasksList(){
    isDescending = !isDescending;
    let arrowClass = isDescending? ARROW_DOWN: ARROW_UP;
    let icon = document.querySelector("#priorityId > i");
    icon.setAttribute("class", arrowClass);
    buildTasks();
}