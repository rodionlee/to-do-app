import './style.css';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { daysInWeek, set } from 'date-fns';
// import { debug } from 'webpack';

// Screen Controller

const screenController = {

    updateScreen: function(lists, selectedListID, selectedTaskID, highLightTask) {
        this.displayLists(lists)
        this.displayTasks(lists[selectedListID].tasks)
        

        this.highlightSelectedList(selectedListID)

        if (highLightTask) {

            this.highlightSelectedTask(selectedTaskID)

            if (lists[selectedListID].tasks[coordinator.convertDOMTaskIDtoTaskIndex(selectedTaskID)]) {
                this.displayTask(lists[selectedListID].tasks[coordinator.convertDOMTaskIDtoTaskIndex(selectedTaskID)], lists[selectedListID].tasks)
            }
        } else this.clearTaskDetails()

        this.addEventListenersToLists()
        this.addEventListenersToTasks()
    },
    displayLists: function(lists) {
        const regularLists = document.querySelector(".regularListsContainer")
        regularLists.innerHTML = ""

        for (const list of lists) {
            const newList = this.createListElement(list.name)
            newList.id = lists.indexOf(list)
            regularLists.appendChild(newList)
        }
    }, 
    createListElement: function(listName) {
        const newList = document.createElement("div")
        newList.className = "list"

        const newListName = document.createElement("p")
        newListName.innerText = listName
        newListName.className = "listName"
        newList.appendChild(newListName)

        const deleteButton = document.createElement("button")
        deleteButton.className = "listDeleteButton"
        deleteButton.innerText = "x"
        newList.appendChild(deleteButton)

        return newList
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
        
    },
    displayTask: function(task, tasks) {
        const taskName = document.querySelector(".taskDetailsContainer .taskName")
        taskName.value = task.name
        
        const dueDateLabel = document.querySelector(".taskDetailsContainer .dueDateLabel")
        if (new Date(task.dueDate).toString() != "Invalid Date") {
            dueDateLabel.innerText = this.processDueDateInRelationToToday(task.dueDate)
        }
        else dueDateLabel.innerText = "Select Date"

        const taskDescription = document.querySelector(".taskDetailsContainer .taskDescription")
        if (task.description) {
            taskDescription.value = task.description
        }
        else taskDescription.value = ""
    },
    clearTaskDetails: function() {
        const taskName = document.querySelector(".taskDetailsContainer .taskName")
        taskName.value = ""
        
        const dueDateLabel = document.querySelector(".taskDetailsContainer .dueDateLabel")
        dueDateLabel.innerText = ""

        const taskDescription = document.querySelector(".taskDetailsContainer .taskDescription")
        taskDescription.value = ""
    },
    createTaskElement: function(task) {
        const newTask = document.createElement("div")
        newTask.className = "task"
        newTask.id = "task" + task.id
        
        const newTaskCheckbox = document.createElement("input")
        newTaskCheckbox.type = "checkbox"
        newTaskCheckbox.className = "checkbox"
        newTask.appendChild(newTaskCheckbox)
        
        const newTaskName = document.createElement("p")
        newTaskName.className = "taskName"
        newTaskName.innerText = task.name
        newTask.appendChild(newTaskName)

        newTask.appendChild(this.createDateLabelElementForTask(task))

        newTask.appendChild(this.createDateInputElementForTask(task))

        const deleteButton = document.createElement("button")
        deleteButton.className = "taskDeleteButton"
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
    createDateLabelElementForTask(task) {
        const dueDateLabel = document.createElement("label")
        dueDateLabel.className = "dueDateLabel"
        dueDateLabel.for = `dueDateInput${task.id}`
        
        if (new Date(task.dueDate).toString() != "Invalid Date") dueDateLabel.innerText = this.processDueDateInRelationToToday(task.dueDate)
        else dueDateLabel.innerText = "Due Date"

        dueDateLabel.addEventListener("click", () => {
            const datepicker = document.getElementById(`dueDateInput${task.id}`)
            datepicker.showPicker()
        })
        
        return dueDateLabel
    },
    createDateInputElementForTask(task) {
        const dueDateInput = document.createElement("input")
        dueDateInput.type = "date"
        dueDateInput.className = "dueDateInput"
        dueDateInput.id = `dueDateInput${task.id}`
        let setDateString = task.dueDate.getFullYear()
        setDateString += "-"

        if (task.dueDate.getMonth() < 8)
            setDateString += "0" + (task.dueDate.getMonth() + 1)
        else setDateString += task.dueDate.getMonth() + 1
        setDateString += "-"

        if (task.dueDate.getDate() < 10)
            setDateString += "0" + task.dueDate.getDate()
        else setDateString += task.dueDate.getDate()
        
        dueDateInput.value = setDateString
        return dueDateInput
    },
    processDueDateInRelationToToday(value) {
        const now = new Date()
        let dueDate = new Date(value)

        const dayDifference = differenceInCalendarDays(dueDate, now)
        let returnDate

        if (dayDifference < 0)
            returnDate = 
                dueDate.getDate() + "/" +
                (dueDate.getMonth() + 1) + "/" +
                dueDate.getFullYear()
        else if (dayDifference < 1)
            returnDate = "Today"
        else if (dayDifference == 1)
            returnDate = "Tomorrow"
        else if (dayDifference < 7) {
            returnDate = dueDate.getDay()

            switch (returnDate) {
                case 1: 
                    returnDate = "Monday"
                    break
                case 2: 
                    returnDate = "Tuesday"
                    break
                case 3: 
                    returnDate = "Wednesday"
                    break
                case 4: 
                    returnDate = "Thursday"
                    break
                case 5: 
                    returnDate = "Friday"
                    break
                case 6: 
                    returnDate = "Saturday"
                    break
                case 0: 
                    returnDate = "Sunday"
                    break
            }
        }

        else if (dayDifference >= 7)
            returnDate = 
                dueDate.getDate() + "/" +
                (dueDate.getMonth() + 1) + "/" +
                dueDate.getFullYear()

        return returnDate
    },
    displayListName: function(listName) {
        const listNameElement = document.querySelector(".selectedListName")
        listNameElement.innerText = listName
    },
    addEventListenersToLists: function() {
        const listNames = document.getElementsByClassName("listName")

        for (const item of listNames) {
            item.addEventListener("click", (e) => {
                const listID = e.path[1].id
                coordinator.selectList(listID)
            })
        }

        const listDeleteButtons = document.getElementsByClassName("listDeleteButton")

        for (const deleteButton of listDeleteButtons) {
            deleteButton.addEventListener("click", (e) => {
                const listID = e.path[1].id
                coordinator.deleteList(listID)
            })
        }
    },
    addEventListenersToTasks: function() {
        const taskCheckboxes = document.getElementsByClassName("checkbox")

        for (const checkbox of taskCheckboxes) {
            
            checkbox.addEventListener("change", checkboxClicked)

            function checkboxClicked(e) {
                const taskID = e.path[1].id
                    if (checkbox.checked === true)
                        coordinator.completeTask(taskID)
                    else coordinator.unCompleteTask(taskID)
            }
        }

        const taskDeleteButtons = document.getElementsByClassName("taskDeleteButton")

        for (const deleteButton of taskDeleteButtons) {
            deleteButton.addEventListener("click", deleteButtonClicked)
        }
        
        function deleteButtonClicked(e) {
            const taskID = e.path[1].id
            coordinator.deleteTask(taskID)
        }

        const dueDateInputs = document.querySelectorAll(".tasksContainer .dueDateInput")

        for (const dueDateInput of dueDateInputs) {
            dueDateInput.addEventListener("change", dueDateInputClicked)
        }

        function dueDateInputClicked(e) {
            const taskID = e.path[1].id
            const newDate = e.srcElement.value
            coordinator.updateTaskDueDate(taskID, newDate)
        }

        const tasks = document.querySelectorAll(".tasksUncompletedContainer .task .taskName")

        for (const task of tasks) {
            task.addEventListener("click", taskClicked)
        }

        function taskClicked(e) {
            const taskID = e.path[1].id
            coordinator.selectTask(taskID)
        }
        
    },
    highlightSelectedList: function(listID) {
        const previousSelectedList = document.querySelector(".listSelected")
        if (previousSelectedList) {
            previousSelectedList.classList.remove("listSelected")
            previousSelectedList.classList.add("list")
        }

        const list = document.getElementById(listID)
        list.classList.add("listSelected")
        list.classList.remove("list")
    },
    highlightSelectedTask: function(taskID) {
        if (taskID) {

            const previousSelectedTask = document.querySelector(".tasksUncompletedContainer .taskSelected")
            if (previousSelectedTask) {
                previousSelectedTask.classList.remove("taskSelected")
                previousSelectedTask.classList.add("task")
            }
            
            const task = document.querySelector(`#${taskID}`)
            task.classList.add("taskSelected")
            task.classList.remove("task")
        }
    },
    addEventListenerToAddNewTaskField: function() {
        const addNewTaskName = document.getElementById("addNewTaskName")

        const addNewTaskDate = document.getElementById("addNewTaskDate")
        addNewTaskName.addEventListener("keyup", (key) => {
            if (key.code === "Enter") coordinator.processAddNewTaskField(addNewTaskName.value, addNewTaskDate.value)
        })
        addNewTaskDate.addEventListener("input", () => {
            if (addNewTaskName.value)
            coordinator.processAddNewTaskField(addNewTaskName.value, addNewTaskDate.value)
        })
    },
    addEventListenerToAddNewListField: function() {
        const addNewListField = document.getElementById("addNewListField")
        addNewListField.addEventListener("keyup", (key) => {
            if (key.code === "Enter") coordinator.processAddNewListField(addNewListField.value)
        })
    },
    addEventListenersToTaskDetails: function() {
        const taskName = document.querySelector(".taskDetailsContainer .taskName")

        let updatedTask = {}
        
        taskName.addEventListener("keyup", addNewTaskName)
        function addNewTaskName(key) {
            if (key.code === "Enter") {
                updatedTask.name = taskName.value
                coordinator.updateTask(updatedTask)
            }
        }

        taskName.addEventListener("focusout", () => {
            if (taskName.value) {
                updatedTask.name = taskName.value
                coordinator.updateTask(updatedTask)
            }
        })

        const dueDateLabel = document.querySelector(".taskDetailsContainer .dueDateLabel")

        dueDateLabel.addEventListener("click", () => {
            const datepicker = document.querySelector(".taskDetailsContainer .dueDateInput")
            datepicker.showPicker()
        })

        const dueDateInput = document.querySelector(".taskDetailsContainer .dueDateInput")
        
        dueDateInput.addEventListener("change", () => {
            updatedTask.dueDate = new Date(dueDateInput.value)
            coordinator.updateTask(updatedTask)
        })

        const taskDescription = document.querySelector(".taskDetailsContainer .taskDescription")
        
        taskDescription.addEventListener("input", () => {
            updatedTask.description = taskDescription.value
            coordinator.updateTask(updatedTask)
        })
    },
    clearAddNewTask: function() {
        const addNewTaskName = document.getElementById("addNewTaskName")
        addNewTaskName.value = ""
        const addNewTaskDate = document.getElementById("addNewTaskDate")
        addNewTaskDate.value = ""
    },
    clearAddNewListField: function() {
        const addNewListField = document.getElementById("addNewListField")
        addNewListField.value = ""
    },
}

// Coordinator

const coordinator = {
    selectedListID: 0,
    selectedTaskID: 0,
    initialize: function() {
        this.addNewList("My List")

        this.addNewTask("Buy milk", 0, new Date())
        this.addNewTask("Buy bananas", 0, new Date("12/20/2022"))
        this.addNewTask("Buy bread", 0, new Date("08/11/2022"))
        
        this.addNewList("My List 2")

        screenController.addEventListenerToAddNewTaskField()
        screenController.addEventListenerToAddNewListField()
        screenController.addEventListenersToTaskDetails()
    },
    updateScreen(highLightTask) {

        screenController.updateScreen(taskController.getLists(), this.selectedListID, this.selectedTaskID, highLightTask)
    },
    addNewList: function(listName) {
        const lists = taskController.addNewList(listName)

        this.updateScreen(false)
    },
    addNewTask: function(taskName, listID, dueDate) {
        const tasks = taskController.addNewTask(taskName, listID, dueDate)
        let newTaskID = tasks.length - 1
        newTaskID = "task" + newTaskID

        this.selectedTaskID = newTaskID

        this.updateScreen(true)
    },
    selectList: function(listID) {
        this.selectedListID = listID
        this.updateScreen(false)
    },
    selectTask: function(taskID) {
        if (taskID) {
            this.selectedTaskID = taskID
            this.updateScreen(true)
        }
    },
    processAddNewTaskField: function(taskName, dueDate) {
        this.addNewTask(taskName, this.selectedListID, dueDate)
        screenController.clearAddNewTask()
    },
    processAddNewListField: function(input) {
        this.addNewList(input)
        this.selectList(taskController.getListID(input))
        screenController.clearAddNewListField()
    },
    completeTask: function(taskID) {
        const task = taskController.getTask(this.convertDOMTaskIDtoTaskIndex(taskID), this.selectedListID)
        taskController.completeTask(task)
        
        if (this.selectedTaskID < taskID) {
            this.updateScreen(true)
        }
        else if (this.selectedTaskID > taskID) {
            this.updateScreen(true)

        }
        else if (this.selectedTaskID == taskID) {
            this.updateScreen(false);
        }
        // else {
        //     console.log("??")
        //     this.updateScreen(false)
        // }
    },
    unCompleteTask: function(taskID) {
        const task = taskController.getTask(this.convertDOMTaskIDtoTaskIndex(taskID), this.selectedListID)
        taskController.unCompleteTask(task)
        this.updateScreen(true)
    },
    deleteTask: function(taskID) {
        const task = taskController.getTask(this.convertDOMTaskIDtoTaskIndex(taskID), this.selectedListID)
        taskController.deleteTask(task)

        if (this.selectedTaskID < taskID) {
            this.updateScreen(true)
        }
        else if (this.selectedTaskID > taskID) {
            this.reduceSelectedTaskIDBy1()
            this.updateScreen(true)
        }
        else {
            this.updateScreen(false)
        } 
    },
    deleteList: function(listID) {
        taskController.deleteList(listID)

        if (listID == this.selectedListID) this.selectList(0)
        else if (this.selectedListID < listID) this.selectList(this.selectedListID)
        else if (this.selectedListID > listID) {
            this.selectedListID--
            this.selectList(this.selectedListID)
        }
        else this.updateScreen()

        screenController.addEventListenersToLists()
    },
    updateTaskDueDate: function(taskID, newDate) {
        taskController.updateTaskDueDate(this.convertDOMTaskIDtoTaskIndex(taskID), this.selectedListID, newDate)

        this.selectTask(this.selectedTaskID) 
    },
    updateTaskName: function(taskID, newName) {
        // console.log(taskID)
        // console.log(newName)
        taskController.updateTaskName(taskID, this.selectedListID, newName)

        this.updateScreen(true)

        // const tasks = taskController.getTasks(this.selectedListID)
        // screenController.displayNames(tasks)

        // this.selectTask(this.selectedTaskID) 
    },

    updateTask(newTask) {
        taskController.updateTask(newTask, this.selectedListID, this.convertDOMTaskIDtoTaskIndex(this.selectedTaskID))
        this.updateScreen(true)
    },
    convertDOMTaskIDtoTaskIndex(taskID) {
        taskID = taskID.slice(4)
        return taskID
    },
    reduceSelectedTaskIDBy1() {
        this.selectedTaskID = "task" + (this.selectedTaskID.slice(4) - 1)
    }
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
        description;
        constructor(name, listID, dueDate) {
            this.name = name
            this.listID = listID
            this.dueDate = new Date(dueDate)
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
    getLists: function() {
        return this.lists
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
        let i = 0
        this.lists[listID].tasks.forEach((task) => {
            task.id = i++
        })
    },
    deleteList: function(listID) {
        this.lists.splice(listID, 1)
        this.updateListIds()
    },
    updateListIds: function() {
        let i = 0
        this.lists.forEach((list) => {
            list.id = i++
        })
    },
    updateTaskDueDate: function(taskID, selectedListID, newDate) {
        const task = this.getTask(taskID, selectedListID)
        task.dueDate = new Date(newDate)
    },
    updateTaskName: function(taskID, listID, newName) {
        const task = this.getTask(taskID, listID)
        task.name = newName
    },
    updateTask: function (newTask, listID, taskID) {
        const task = this.getTask(taskID, listID)
        if (newTask.name) task.name = newTask.name
        if (newTask.dueDate) task.dueDate = newTask.dueDate
        if (newTask.description) task.description = newTask.description
    },
    // debug() {
    //     console.log("Lists:")
    //     console.log(this.lists)
    //     console.log("Tasks of List 0:")
    //     console.log(this.lists[0].tasks)
    // }
}


// Invocations

coordinator.initialize()

// setTimeout(taskController.debug, 1000)
// setTimeout(taskController.debug, 5000)
