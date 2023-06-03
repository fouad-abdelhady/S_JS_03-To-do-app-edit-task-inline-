let tasksArray = [
    ["Nathalie Nader Nabil", "Task 01", "Option 2"],
    ["Youssef Mohamed Ahmed Mohamed Youssef", "Task 01", "Option 1"],
    ["Salma Nasreldin", "Task 01", "Option 1"],
    ["Engy Mostafa", "Task 01", "Option 1"],
    ["Engy Mostafa", "Task 01", "Option 1"],
    ["Engy ahmed mostafa ", "Task 01", "Option 1"],
    ["Abdelhay Nader Abdelhay Abozayed", "Task 01", "Option 1"],
    ["Abdelrahman Shemies", "Task 01", "Option 1"],
    ["Alaa Ahmed", "Task 01", "Option 2"],
    ["Youssef Fathy Mahmoud", "Task 01", "Option 1"],
    ["Mark Bassem", "Task 01", "Option 1"],
    ["Anas Ahmed", "Task 01", "Option 1"],
    ["Adham Hesham", "Task 01", "Option 1"],
    ["Mohamed Ahmed Fahmi", "Task 01", "Option 1"],
    ["rola wafi", "Task 01", "Option 1"],
    ["Moataz Youssef", "Task 01", "Option 2"],
    ["Ahmad Salama", "Task 01", "Option 1"],
    ["Mohamed Ahmed Fahmi", "Task 01", "Option 1"],
    ["Ahmad Salama Abdelaziz", "Task 01", "Option 2"],
    ["Kareem Ramzi El-Tahlawi", "Task 01", "Option 1"],
    ["Alaa Ahmed", "Task 01", "Option 2"],
    ["rola wafi", "Task 01", "Option 2"],
    ["Mohamed Fahmi", "Task 01", "Option 1"],
    ["Mohamed Fahmi", "Task 01", "Option 2"],
    ["Alaa Ahmed", "Task 01", "Option 2"],
    ["Abdelrahman Shemies", "Task 01", "Option 1"],
    ["Nathalie Nader", "Task 01", "Option 1"],
    ["Mariam Ahmed", "Task 01", "Option 1"],
  ];



  function solutionOne(){
    let uniqueNames = new Set();
    tasksArray.map((studentInfo, index, studentsList)=>{
        uniqueNames.add(studentInfo[0].toLowerCase());
        return true;
    });
    console.log("******************************************************************");
    console.log(`There are ${tasksArray.length} names in the list ${uniqueNames.size} of them unique : `);
    console.log("------------------------------------------------------------------");
    let camelCaseName;
    uniqueNames.forEach((fullName)=>{
       camelCaseName =  fullName.split(' ').map((name, index, list)=>{
            return name.charAt(0).toUpperCase()+name.slice(1); 
        }).join(" ");
        console.log("  "+camelCaseName);        
    });
    console.log("------------------------------------------------------------------");
  }


  class Student{
    studentName;
    tasks;
    options;
    constructor(studentName){
        this.studentName = studentName;
        this.tasks = new Set();
        this.options = new Set();
    }
    addTask(task){
        this.tasks.add(task);
    }
    addOption(option){
        this.options.add(option);
    }
    showTasks(){
        this._show(this.tasks);
    }
    showOptions(){
        this._show(this.options)
    }
    _show(setParam){
        setParam.forEach((value)=>{
            console.log("   "+value);
        });
    }
  }
  function solution2(){
    let students = new Map();
    tasksArray.forEach((studentInfo)=>{
        addStudent(studentInfo, students)
    });
    showStudentsData(students);
  }
  function showStudentsData(students){
    students.forEach((student, key)=>{
        console.log(`------------------------------${student.studentName}-------------------------------------`);
        console.log(` The Tasks are `);
        student.showTasks();
        console.log(` The Options are `);
        student.showOptions();
        console.log(` `);
    });
    console.log(`There are ${tasksArray.length} names in the list ${students.size} of them unique`);
  }
  function addStudent(studentInfo, students){
    if(students.has(studentInfo[0].toLowerCase())){
        students.get(studentInfo[0].toLowerCase()).addTask(studentInfo[1]);
        students.get(studentInfo[0].toLowerCase()).addOption(studentInfo[2]);
        return;
    }
    let student = new Student(studentInfo[0]);
    student.addTask(studentInfo[1]);
    student.addOption(studentInfo[2]);
    students.set(student.studentName.toLowerCase(), student);
  }
  solutionOne();