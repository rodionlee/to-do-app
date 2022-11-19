import './style.css';

// Screen Controller

const screenController = {
    displayLists: function(lists) {
        const regularLists = document.querySelector(".regularListsContainer")
        regularLists.innerHTML = ""
        let i = 0

        for (const list of lists) {
            const newList = document.createElement("div")
            newList.innerText = list.name
            newList.className = "list"
            newList.id = i++
            
            regularLists.appendChild(newList)
        }
    },
    displayTasks: function(tasks) {
        const tasksUncompletedContainer = document.querySelector(".tasksUncompletedContainer")
        tasksUncompletedContainer.innerHTML = ""

        const tasksCompletedContainer = document.querySelector(".tasksCompletedContainer")
        tasksCompletedContainer.innerHTML = ""

        for (const task of tasks) {
            const newTask = this.createTaskElement(task)
            if (task.completed == false) {
                tasksUncompletedContainer.appendChild(newTask)
            } else {
                tasksCompletedContainer.appendChild(newTask)
            }

        }
        this.addEventListenersToTasks()
    },
    createTaskElement: function(task) {
        const newTask = document.createElement("div")
        newTask.className = "task"
        newTask.id = task.id
        console.log(newTask)
        
        const newTaskCheckbox = document.createElement("input")
        newTaskCheckbox.type = "checkbox"
        newTaskCheckbox.className = "checkbox"
        newTask.appendChild(newTaskCheckbox)
        
        const newTaskDescription = document.createElement("p")
        newTaskDescription.className = "taskDescription"
        newTaskDescription.innerText = task.description
        newTask.appendChild(newTaskDescription)

        const deleteButton = document.createElement("button")
        deleteButton.className = "deleteButton"
        deleteButton.innerText = "x"
        newTask.appendChild(deleteButton)

        if (task.completed == false) {
            newTaskCheckbox.checked = false
        } else {
            newTaskCheckbox.checked = true
            newTask.className = "taskCompleted"
        }
        return newTask
    },
    displayListName: function(listName) {
        const listNameElement = document.querySelector(".listName")
        listNameElement.innerText = listName

    },
    addEventListenersToLists: function() {
        const lists = document.getElementsByClassName("list")

        for (const item of lists) {
            item.addEventListener("click", (e) => coordinator.processListClick(e))
        }
    },
    addEventListenersToTasks: function() {
        const taskCheckboxes = document.getElementsByClassName("checkbox")

        for (const checkbox of taskCheckboxes) {
            checkbox.addEventListener("change", (e) => {
                const taskID = e.path[1].id
                if (checkbox.checked === true)
                    coordinator.completeTask(taskID)
                else coordinator.unCompleteTask(taskID)
            })
        }

        const taskDeleteButtons = document.getElementsByClassName("deleteButton")

        for (const deleteButton of taskDeleteButtons) {
            deleteButton.addEventListener("click", (e) => {
                const taskID = e.path[1].id
                coordinator.deleteTask(taskID)
            })
        }
        
    },
    highlightSelectedList: function(listID) {
        const lists = document.getElementsByClassName("list")
        for (const list of lists) list.classList.remove("listSelected")

        const list = document.getElementById(listID)
        list.classList.add("listSelected")
    },
    addEventListenerToAddNewTaskField: function() {
        const addNewTaskField = document.getElementById("addNewTaskField")
        addNewTaskField.addEventListener("keyup", (key) => {
            if (key.code === "Enter") coordinator.processAddNewTaskField(addNewTaskField.value)
        })
    },
    addEventListenerToAddNewListField: function() {
        const addNewListField = document.getElementById("addNewListField")
        addNewListField.addEventListener("keyup", (key) => {
            if (key.code === "Enter") coordinator.processAddNewListField(addNewListField.value)
        })
    },
    clearAddNewTaskField: function() {
        const addNewTaskField = document.getElementById("addNewTaskField")
        addNewTaskField.value = ""
    },
    clearAddNewListField: function() {
        const addNewListField = document.getElementById("addNewListField")
        addNewListField.value = ""
    },
    
}

// Coordinator

const coordinator = {
    selectedListID: 0,
    initialize: function() {
        this.addNewList("My List")

        this.addNewTask("Buy milk", 0, "23/11/2022")
        this.addNewTask("Buy bananas", 0, "23/11/2022")
        this.addNewTask("Buy bread", 0, "23/11/2022")

        this.addNewList("My List 2")

        // this.addNewTask("Buy milk 2", 1, "23/11/2022")
        // this.addNewTask("Buy bananas 2", 1, "23/11/2022")
        // this.addNewTask("Buy bread 2", 1, "23/11/2022")

        this.selectList(this.selectedListID)

        screenController.addEventListenerToAddNewTaskField()
        screenController.addEventListenerToAddNewListField()
    },
    addNewList: function(listName) {
        const lists = taskController.addNewList(listName)
        screenController.displayLists(lists)
        screenController.addEventListenersToLists()
    },
    addNewTask: function(task, listID, dueDate) {
        const tasks = taskController.addNewTask(task, listID, dueDate)
        screenController.displayTasks(tasks)
    },
    selectList: function(listID) {
        screenController.highlightSelectedList(listID)

        const tasks = taskController.getTasks(listID)
        screenController.displayTasks(tasks)

        const listName = taskController.getListName(listID)
        screenController.displayListName(listName)

        this.selectedListID = listID
    },
    processListClick: function(e) {
        const listID = e.srcElement.id
        this.selectList(listID)
    },
    processAddNewTaskField: function(input) {
        this.addNewTask(input, this.selectedListID, "10/10/1900")
        screenController.clearAddNewTaskField()
    },
    processAddNewListField: function(input) {
        this.addNewList(input)
        this.selectList(taskController.getListID(input))
        screenController.clearAddNewListField()
    },
    completeTask: function(taskID) {
        const task = taskController.getTask(taskID, this.selectedListID)
        taskController.completeTask(task)
        const tasks = taskController.getTasks(this.selectedListID)
        screenController.displayTasks(tasks)
    },
    unCompleteTask: function(taskID) {
        const task = taskController.getTask(taskID, this.selectedListID)
        taskController.unCompleteTask(task)
        const tasks = taskController.getTasks(this.selectedListID)
        screenController.displayTasks(tasks)
    },
    deleteTask: function(taskID) {
        const task = taskController.getTask(taskID, this.selectedListID)
        taskController.deleteTask(task)
        const tasks = taskController.getTasks(this.selectedListID)
        screenController.displayTasks(tasks)
    },


}

// Task Controller

const taskController = {
    lists: [],

    listClass: class {
        tasks = []
        id;
        constructor(name) {
            this.name = name
        }
    },

    taskClass: class {
        id;
        completed = false;
        constructor(description, listID, dueDate) {
            this.description = description
            this.listID = listID
            this.dueDate = dueDate
        }
    },

    addNewList: function(listName) {
        const newList = new this.listClass(listName)
        this.lists.push(newList)
        newList.id = this.lists.indexOf(newList)
        return this.lists
    },
    addNewTask: function(task, listID, dueDate) {
        const newTask = new this.taskClass(task, listID, dueDate)
        this.lists[listID].tasks.push(newTask)
        newTask.id = `${this.lists[listID].tasks.indexOf(newTask)}`
        return this.lists[listID].tasks
    },
    getTasks: function(listID) {
        return this.lists[listID].tasks
    },
    getListID: function(listName) {
        for (const list of this.lists) {
            if (list.name === listName) return list.id
        }
    },
    getListName: function(listID) {
        return this.lists[listID].name
    },
    getTask: function(taskID, selectedListID) {
        const taskIndex = Number(taskID)
        return this.lists[selectedListID].tasks[taskIndex]
    },
    completeTask: function(task) {
        task.completed = true
    },
    unCompleteTask: function(task) {
        task.completed = false
    },
    deleteTask: function(task) {
        const listID = task.listID
        this.lists[listID].tasks.splice(task.id,1)
        this.updateTaskIds(listID)
    },
    updateTaskIds: function(listID) {
        console.log(this.lists[listID])
        let i = 0

        this.lists[listID].tasks.forEach((task) => {
            task.id = i++
        })
    }
}

// Invocations

coordinator.initialize()
