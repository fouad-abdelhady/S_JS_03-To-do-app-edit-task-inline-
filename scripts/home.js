class Task {
    #taskName;
    #status;
    #priority;
    #index;
    #taskManager;
    #marked;
    constructor(taskName, status, priority, taskManager){
        this.#taskName = taskName;
        this.#status = status ?? 0;
        this.#priority = priority;
        this.#taskManager= taskManager;
        this.#marked = false;
    }
    setTaskName(taskName){
        this.#taskName = taskName;
    }
    setStatus(status){
        this.#status = status;
    }
    setPriority(priority){
        this.#priority = priority; 
    }
    setIsMarked(isMarked){
        this.#marked = isMarked;
    }
    getTaskName(){
        return this.#taskName;
    }
    getStatus(){
        return this.#status;
    }
    getPriority(){
        return this.#priority;
    }
    isMarked(){
        return this.#marked;
    }
    buildTaskInTableRow(index, counter){
        this.#index = index;
        let task = document.createElement("tr");
        task.setAttribute("class", "mt-1");
        task.appendChild(this.#buildTableDetail(counter));
        task.appendChild(this.#buildTaskName());
        task.appendChild(this.#buildPriority());
        task.appendChild(this.#buildStatus());
        task.appendChild(this.#buildActions());
        task.appendChild(this.#buildCheckBox());
        return task;
    }
    #buildTableDetail(content){
        let td = document.createElement("td");
        td.setAttribute("class", "text-center");
        if(content instanceof Element) td.appendChild(content);
        else td.innerHTML = content;
        return td;
    }
    #buildTaskName(){
        if(!this.#isCurrentlyUpdatingThisTask()) 
            return this.#buildTableDetail(this.#taskName);
        return this.#buildTextField(this.#taskName, this.#taskManager.NEW_NAME_ID, "New Name Here");
    }
    #isCurrentlyUpdatingThisTask(){
        let taskLocation = this.#taskManager.taskLocation;
        if(!this.#taskManager.isCurrentlyUpdating) 
            return false;
        if(taskLocation.priority === -1 || taskLocation.index ===-1) 
            return false;
        if(taskLocation.priority === this.#priority && taskLocation.index === this.#index)
            return true;
        return false;
    }
    #buildPriority(){
        if(!this.#isCurrentlyUpdatingThisTask()) return this.#buildTableDetail(this.#getPriority());
    
        let selectPri = document.createElement("select");
        selectPri.setAttribute("class", "form-select");
        selectPri.setAttribute("id", this.#taskManager.NEW_PRI_ID);
        let option;
        for(let i = 0; i< this.#taskManager.TASKS.length ; i++){
            option = document.createElement("option");
            option.setAttribute("value", `${i}`);
            option.innerHTML = this.#getPriority(i);
            selectPri.appendChild(option);
        }
        selectPri.selectedIndex = this.#priority;
        return this.#buildTableDetail(selectPri);
    }
    #getPriority(priority){
        priority ??= this.#priority;
        if(priority == 0) return "Very High";
        if(priority == 1) return "High";
        if(priority == 2) return "Medium";
        if(priority== 3) return "Low";
        if(priority == 4) return "Very Low"
        else return "-";
    }
    #buildStatus(){
        if(!this.#isCurrentlyUpdatingThisTask()) return this.#buildTableDetail(this.#getStatus());
        let selectStatus = document.createElement("select");
        selectStatus.setAttribute("class", "form-select");
        selectStatus.setAttribute("id", this.#taskManager.NEW_STATUS);
        let option;
        for(let i = 0; i< 5 ; i++){
            option = document.createElement("option");
            option.setAttribute("value", `${i}`);
            option.innerHTML = this.#getStatus(i);
            selectStatus.appendChild(option);
        }
        selectStatus.selectedIndex = this.#status;
        return this.#buildTableDetail(selectStatus);
    }
    #getStatus(status){
        status ??= this.#status;
        if(status == 0) return "Pending";
        if(status == 1) return "Open";
        if(status == 2) return "Under Review";
        if(status == 3) return "Reviewed";
        if(status == 4) return "Done";
        else return "-";
    }
    #buildActions(){
        let td = document.createElement("td");
        td.setAttribute("class", "text-center");
        td.appendChild(this.#buildActionsButtons());
        return td;
    }
    #buildActionsButtons(){
        let buttonsGroup = document.createElement("div");
        let negativeButton = this.#buildButton(
            "btn-outline-danger", null, 
            "fa-regular fa-trash-can", `tasksManager.removeTask(${this.#priority}, ${this.#index})`
            );
        let positiveButton = this.#buildButton(
            "btn-outline-primary", null,
            "fa-regular fa-pen-to-square", `tasksManager.updateTask(${this.#priority}, ${this.#index})`
        );
    
        if(this.#isCurrentlyUpdatingThisTask()){
            negativeButton = this.#buildButton(
                "btn-outline-danger", null, 
                "fa-solid fa-xmark", `tasksManager.cancelUpdate()`
                );
            positiveButton = this.#buildButton(
                "btn-outline-primary",null,
                "fa-regular fa-floppy-disk", `tasksManager.saveChanges()`
            );
        }
    
        buttonsGroup.appendChild(positiveButton);
        buttonsGroup.appendChild(negativeButton);
        buttonsGroup.setAttribute("class", "btn-group");
        return buttonsGroup;
    }
     #buildTextField(taskName, id, placeHolder, type = "text"){
   
        let textField = document.createElement("input");
        textField.setAttribute("id", id);
        textField.setAttribute("class", "form-control text-center");
        textField.setAttribute("type", type);
        textField.setAttribute("placeholder", placeHolder);
        textField.value = taskName;
        return this.#buildTableDetail(textField, true);
    }
    #buildButton(buttonShapeColor, specialClass, buttonIcon, callBack){
        let button = document.createElement("button");
        button.setAttribute("class", `btn ${buttonShapeColor} pt-1 pb-1 ${specialClass || ""}`);
        let icon = document.createElement('i');
        icon.setAttribute('class', buttonIcon);
        icon.style.fontSize= "1.2rem";
        button.appendChild(icon);
        button.setAttribute("onclick", callBack);
        return button;
    }
    #buildCheckBox(){
        let checkBox = document.createElement("input");
        checkBox.checked = this.#marked;
        checkBox.setAttribute("class", "form-check-input");
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("onchange", `tasksManager.markTask(${this.#priority}, ${this.#index}, this)`);
        return this.#buildTableDetail(checkBox);
    }
}
/**Builders ***************************************************/


class TasksManager{
    NEW_NAME_ID = "updateNameId";
    NEW_PRI_ID = "updatePriorityId";
    NEW_STATUS = "updateStatusId";
    ARROW_DOWN = "fa-sharp fa-solid fa-caret-down";
    ARROW_UP = "fa-solid fa-caret-up";

    TASKS;
    isCurrentlyUpdating;
    isDescending;
    taskLocation;
    constructor(){
        this.TASKS = [[],[],[],[],[]];
        this.isCurrentlyUpdating = false;
        this.isDescending = true;
        this.taskLocation = {priority: -1, index: -1}
    }
    buildTasks(){
        let tableBody = document.getElementById("tableBody");
        tableBody.innerHTML="";
        let counter = 1;
        let priority = this.TASKS.length - 1;
        let deleteButton = document.getElementById("deletAllMarked");
        let showDelete = false;
        for(let i = 0; i < this.TASKS.length; i++){
            priority = this.isDescending? i: priority - i;
            if(this.TASKS[priority].length == 0) { priority = this.TASKS.length - 1; continue;}
            for(let index = 0 ; index < this.TASKS[priority].length; index++){
                tableBody.append(this.TASKS[priority][index].buildTaskInTableRow(index, counter));
                showDelete |= this.TASKS[priority][index].isMarked();
                counter++;
            }
            if(!this.isDescending) priority = this.TASKS.length - 1;
        }
        if(showDelete){
            deleteButton.style.display = "block"; return;
        }
        deleteButton.style.display = "none";
    }

    addTask(){
        let priority = Number(document.getElementById("taskPriority").value);
       // this.validate(null, "taskPriority", "Please Select Valid Priority");
        let taskName = document.getElementById("taskName").value;
        if(!this.validate(taskName, "taskName")) return;
        let task = new Task(taskName, 0 , priority, this);
        document.getElementById("taskName").value = "";
        this.TASKS[priority].push(task);
        this.buildTasks();
    }

    validate(text, formId, message){
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
    removeTask(priority, index){
        let message = `Are you sure you want to delete the task ${this.TASKS[priority][index]}?`;
        if(confirm(message)){
            this.TASKS[priority].splice(index, 1);
            this.buildTasks();
        }
    }

    updateTask(priority, index){
        if(this.isCurrentlyUpdating) return;
        this.isCurrentlyUpdating=true;
        this.taskLocation.priority = priority;
        this.taskLocation.index = index;
        this.buildTasks();
    }
    cancelUpdate(){
        this.isCurrentlyUpdating=false;
        this.taskLocation.priority = -1;
        this.taskLocation.index = -1;
        this.buildTasks();
    }
    saveChanges(){
        let newName = document.getElementById(this.NEW_NAME_ID).value;
        if(!this.validate(newName, this.NEW_NAME_ID)) return;
        let priority = Number(document.getElementById(this.NEW_PRI_ID).value);
        this.isCurrentlyUpdating = false;
        let status = Number(document.getElementById(this.NEW_STATUS).value);
        let task = this.TASKS[this.taskLocation.priority][this.taskLocation.index];
        let locationChanged = priority != task.getPriority();
        if(priority == task.getPriority() && newName == task.getTaskName() && status === task.getStatus()) return;
        task.setTaskName(newName);
        task.setPriority(priority);
        task.setStatus(status);
        if(locationChanged){
            this.TASKS[this.taskLocation.priority].splice(this.taskLocation.index, 1);
            this.TASKS[task.getPriority()].push(task);
        }
        this.buildTasks();
    }
    getHighestPriorityTask(){
        for(let priority = 0; priority < this.TASKS.length; priority++){
            if(this.TASKS[priority].length == 0) continue;
            alert(`The Highest Priority task is ${this.TASKS[priority][0]} `);
            break;
        }
    } 

    sortTasksList(){
        this.isDescending = !this.isDescending;
        let arrowClass = this.isDescending? this.ARROW_DOWN: this.ARROW_UP;
        let icon = document.querySelector("#priorityId > i");
        icon.setAttribute("class", arrowClass);
        this.buildTasks();
    }
    markTask(priority, index, checkBox){
        this.TASKS[priority][index].setIsMarked(checkBox.checked);
        this.buildTasks();
    }
    deleteMarked(){

        if(!confirm("Are you sure you want to delete the marked task?")) return;
        let temp = [[],[],[],[],[]];
        for(let i = 0; i < this.TASKS.length; i++){
            for(let j = 0; j< this.TASKS[i].length; j++){
                if(!this.TASKS[i][j].isMarked()){
                    temp[i].push(this.TASKS[i][j]);
                }
            }
        }
        this.TASKS = temp;
        this.buildTasks();
    }

}
let tasksManager = new TasksManager();