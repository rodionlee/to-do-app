import 'material-icons/iconfont/material-icons.css';
import './style.css';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { addMinutes, daysInWeek, set } from 'date-fns';
// import { debug } from 'webpack';

// Screen Controller

const screenController = {

    updateScreen: function(displayData) {
        this.displayLists(displayData.myLists)
        this.displayListName(displayData.listName)
        this.highlightSelectedList(displayData.listID)
        this.displayTasks(displayData.tasks)

        if (displayData.highLightTask) {
            this.highlightSelectedTask(displayData.taskID)
            this.displayTask(displayData.task)
        } else this.clearTaskDetails()


        this.addEventListenersToLists()
        this.addEventListenersToTasks()
        this.addEventListenerToAddNewListField()
        this.addEventListenerToAddNewTaskField()
    },
    displayLists: function(lists) {
        const regularListsContainer = document.querySelector(".regularListsContainer")
        regularListsContainer.innerHTML = ""

        for (const list of lists) {
            const newList = this.createListElement(list.name)
            newList.id = lists.indexOf(list)
            regularListsContainer.appendChild(newList)
        }
        regularListsContainer.appendChild(this.createAddList())
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

        tasksUncompletedContainer.appendChild(this.createAddTaskFieldName())
        tasksUncompletedContainer.appendChild(this.createAddTaskDueDateInput())
        tasksUncompletedContainer.appendChild(this.createAddTaskDueDateLabel())
    },
    displayTask: function(task) {
        const taskName = document.querySelector(".taskDetailsContainer .taskName")
        taskName.value = task.name
        
        const dueDateLabel = document.querySelector(".taskDetailsContainer .dueDateLabel")
        dueDateLabel.innerHTML = ""
        if (new Date(task.dueDate).toString() != "Invalid Date") {
            dueDateLabel.appendChild(this.createIcon("calendar_today"))

            const dueDate = document.createElement("p")
            dueDate.innerText = this.processDueDateInRelationToToday(task.dueDate)
            dueDateLabel.appendChild(dueDate)
        }
        else dueDateLabel.innerText = "Select Date"

        const taskDescription = document.querySelector(".taskDetailsContainer .taskDescription")
        taskDescription.classList.add("taskDescriptionActive")
        if (task.description) {
            taskDescription.value = task.description
        }
        else taskDescription.value = ""
    },
    displayListName: function(listName) {
        const listNameElement = document.querySelector(".selectedListName")
        listNameElement.innerText = listName
    },
    createAddList() {
        const addListField = document.createElement("input")
        addListField.type = "text"
        addListField.id = "addNewListField"
        addListField.className = "inputField"
        addListField.placeholder = "+ Add List"
        return addListField
    },
    createTaskElement: function(task) {
        const newTask = document.createElement("div")
        newTask.className = "task"
        newTask.id = task.id
        
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

        const deleteButton = document.createElement("div")
        deleteButton.className = "taskDeleteButton"
        deleteButton.appendChild(this.createIcon("delete_outline"))

        newTask.appendChild(deleteButton)

        if (task.completed == false) {
            newTaskCheckbox.checked = false
        } else {
            newTaskCheckbox.checked = true
            newTask.className = "taskCompleted"
        }
        return newTask
    },
    createListElement: function(listName) {
        const newList = document.createElement("div")
        newList.className = "list"

        const newListName = document.createElement("p")
        newListName.innerText = listName
        newListName.className = "listName"
        newList.appendChild(newListName)

        const deleteButton = document.createElement("div")
        deleteButton.className = "listDeleteButton"
        deleteButton.appendChild(this.createIcon("delete_outline"))
        newList.appendChild(deleteButton)

        return newList
    },
    createDateLabelElementForTask(task) {
        const dueDateLabel = document.createElement("label")
        dueDateLabel.className = "dueDateLabel"
        dueDateLabel.for = `dueDateInput${task.id}`
        
        if (new Date(task.dueDate).toString() != "Invalid Date") dueDateLabel.innerText = this.processDueDateInRelationToToday(task.dueDate)
        else dueDateLabel.appendChild(this.createIcon("calendar_today"))

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
    createAddTaskFieldName() {
        const addTaskField = document.createElement("input")
        addTaskField.type = "text"
        addTaskField.id = "addNewTaskName"
        addTaskField.className = "inputField"
        addTaskField.placeholder = "+ Add Task"
        return addTaskField
    },
    createAddTaskDueDateInput() {
        const addTaskDueDateInput = document.createElement("input")
        addTaskDueDateInput.type = "date"
        addTaskDueDateInput.id = "addNewTaskDate"
        addTaskDueDateInput.className = "addTaskDueDateInput"
        return addTaskDueDateInput
    },
    createAddTaskDueDateLabel() {
        const addTaskDueDateLabel = document.createElement("label")
        addTaskDueDateLabel.className = "addTaskDueDateLabel"
        addTaskDueDateLabel.for = `addNewTaskDate`
        addTaskDueDateLabel.innerHTML = ""

        addTaskDueDateLabel.appendChild(this.createIcon("calendar_today"))
        
        addTaskDueDateLabel.addEventListener("click", () => {
            const datepicker = document.getElementById(`addNewTaskDate`)
            datepicker.showPicker()
        })
        
        return addTaskDueDateLabel
    },
    createIcon(name) {
        const icon = document.createElement("span")
        icon.className = "material-icons-round"
        icon.innerHTML = name
        return icon
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
    addEventListenersToLists: function() {
        const listNames = document.querySelectorAll(".listName")

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
            checkbox.addEventListener("change", e => {
                const taskID = e.path[1].id
                if (checkbox.checked === true)
                    coordinator.completeTask(taskID)
                else coordinator.unCompleteTask(taskID)
            })
        }

        const taskDeleteButtons = document.getElementsByClassName("taskDeleteButton")

        for (const deleteButton of taskDeleteButtons) {
            deleteButton.addEventListener("click", e => {
                const taskID = e.path[2].id
                coordinator.deleteTask(taskID)
            })
        }
        
        const dueDateInputs = document.querySelectorAll(".tasksContainer .dueDateInput")

        for (const dueDateInput of dueDateInputs) {
            dueDateInput.addEventListener("change", e => {
                const taskID = e.path[1].id
                const newDate = e.srcElement.value
                coordinator.updateTaskDueDate(taskID, newDate)
            })
        }

        const tasks = document.querySelectorAll(".tasksUncompletedContainer .task .taskName")

        for (const task of tasks) {
            task.addEventListener("click", (e) => {
                const taskID = e.path[1].id
                coordinator.selectTask(taskID)
            })
        }
    },
    addEventListenerToAddNewTaskField: function() {
        const addNewTaskName = document.getElementById("addNewTaskName")

        const addNewTaskDate = document.getElementById("addNewTaskDate")

        addNewTaskName.addEventListener("keyup", (key) => {
            if (key.code === "Enter") 
                coordinator.processAddNewTaskField(addNewTaskName.value, addNewTaskDate.value)
        })
        addNewTaskDate.addEventListener("input", () => {
            const addTaskDueDateLabel = document.querySelector(".addTaskDueDateLabel")
            addTaskDueDateLabel.innerText = this.processDueDateInRelationToToday(addNewTaskDate.value)
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
    addEventListenersToSmartLists: function() {
        const smartLists = document.querySelectorAll(".smartListsContainer .list")

        smartLists.forEach(smartList => {
            smartList.addEventListener("click", () => {
                const smartListID = smartList.id
                coordinator.selectList(smartListID)
            })
        })
    },
    addEventListenerToListsToggle() {
        const listsToggle = document.querySelector(".listsToggle")
        listsToggle.addEventListener("click", this.toggleListsContainer)
    },
    addEventListenerToThemeToggle() {
        const themeToggle = document.querySelector(".themeToggle")
        themeToggle.addEventListener("click", this.toggleTheme)
    },
    highlightSelectedList: function(listID) {
        const previousSelectedList = document.querySelector(".listSelected")
        if (previousSelectedList) {
            previousSelectedList.classList.toggle("listSelected")
        }

        const list = document.getElementById(listID)
        list.classList.toggle("listSelected")
    },
    highlightSelectedTask: function(taskID) {
        if (taskID) {

            // const previousSelectedTask = document.querySelector(".tasksUncompletedContainer .taskSelected")
            // if (previousSelectedTask) {
            //     previousSelectedTask.classList.toggle("taskSelected")
            // }
            
            const task = document.querySelector(`#${taskID}`)
            if (task) {
                task.classList.toggle("taskSelected")
            }
        }
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
    clearTaskDetails: function() {
        const taskName = document.querySelector(".taskDetailsContainer .taskName")
        taskName.value = ""
        
        const dueDateLabel = document.querySelector(".taskDetailsContainer .dueDateLabel")
        dueDateLabel.innerText = ""

        const taskDescription = document.querySelector(".taskDetailsContainer .taskDescription")
        taskDescription.value = ""
        taskDescription.classList.remove("taskDescriptionActive")
    },
    toggleListsContainer: function() {
        const listsContainer = document.querySelector(".listsContainer")
        listsContainer.classList.toggle("listsContainerClosed")

        const listsToggle = document.querySelector(".listsToggle")
        listsToggle.classList.toggle("listsToggleOn")

        const tasksContainer = document.querySelector(".tasksContainer")
        tasksContainer.classList.toggle("tasksContainerListsToggleOn")

        const taskDetailsContainer = document.querySelector(".taskDetailsContainer")
        taskDetailsContainer.classList.toggle("taskDetailsContainerListsToggleOn")
    },
    toggleTheme: function() {
        const body = document.querySelector("body")
        body.classList.toggle("lightTheme")
        body.classList.toggle("darkTheme")
    }

}

// Coordinator

const coordinator = {
    selectedListID: 0,
    selectedTaskID: "task0list0",
    initialize: function() {
        this.createDummyListsAndTasks()

        screenController.addEventListenersToTaskDetails()
        screenController.addEventListenerToListsToggle()
        screenController.addEventListenersToSmartLists()
        screenController.addEventListenerToThemeToggle()
    },
    createDummyListsAndTasks() {
        const today = new Date()
        const tomorrow = new Date().setDate(today.getDate() + 1)
        const in3Days = new Date().setDate(today.getDate() + 3)
        const in10Days = new Date().setDate(today.getDate() + 10)

        this.addNewList("My List")

        this.addNewTask("Meditate", 0, today)
        this.addNewTask("Go to the gym", 0, today)
        this.addNewTask("Buy groceries 🥑", 0, today)
        this.addNewTask("Dental Appointment", 0, tomorrow)
        taskController.getTaskByID("task3list0").description = 
            "Eat 2-3 hours before the appointment to reduce salivation. Don't forget to brush your teeth"
        this.addNewTask("Meeting with Bob", 0, tomorrow)
        this.addNewTask("Interview", 0, in3Days)
        this.addNewTask("Hiking with friends", 0, in10Days)
        
        this.addNewList("Groceries 🥑")

        this.addNewTask("Bread 🥖", 1, today)
        this.addNewTask("Milk 🥛", 1, today)
        this.addNewTask("Apples 🍏", 1, today)
    },
    updateScreen(highLightTask) {
        taskController.createSmartLists()

        let displayData = {
            smartLists: [],
            myLists: taskController.getLists(),
            listIndex: this.selectedListID,
            listID: this.selectedListID,
            tasks: [],
            task: {},
            taskID: this.selectedTaskID,
            highLightTask: highLightTask,
            listName: ""
        }

        if (String(this.selectedListID).includes("smart")) {
            displayData.smartLists = taskController.getSmartLists()
            displayData.listIndex = displayData.smartLists.indexOf(displayData.smartLists.find(item => item.id == this.selectedListID))
            displayData.listName = displayData.smartLists[displayData.listIndex].name
            displayData.tasks = displayData.smartLists[displayData.listIndex].tasks
        }
        else {
            displayData.listName = displayData.myLists[displayData.listIndex].name
            displayData.tasks = displayData.myLists[displayData.listIndex].tasks
        }
        
        if (displayData.highLightTask == false) {
            displayData.taskID = "task0list0"
        } else {
            displayData.task = taskController.getTaskByID(displayData.taskID)
        }

        screenController.updateScreen(displayData)
    },
    addNewList: function(listName) {
        const lists = taskController.addNewList(listName)

        this.updateScreen(false)
    },
    addNewTask: function(taskName, listID, dueDate) {
        if (String(listID).includes("smart")) {
            listID = 0
        }
        const task = taskController.addNewTask(taskName, listID, dueDate)
        this.selectedTaskID = task.id
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
        let listID = 0

        if (String(this.selectedListID).includes("smart")) {
            listID = 0
        } else {
            listID = this.selectedListID
        }

        this.addNewTask(taskName, listID, dueDate)
        screenController.clearAddNewTask()
    },
    processAddNewListField: function(input) {
        this.addNewList(input)
        this.selectList(taskController.getListID(input))
        screenController.clearAddNewListField()
    },
    completeTask: function(taskID) {
        taskController.completeTask(taskID)
        const selectedTaskIndex = taskController.getTaskIndexByID(this.selectedTaskID)
        const taskIndex = taskController.getTaskIndexByID(taskID)

        
        if (selectedTaskIndex < taskIndex) {
            this.updateScreen(true)
        }
        else if (selectedTaskIndex > taskIndex) {
            // this.reduceSelectedTaskIDBy1()
            this.updateScreen(true)
        }
        else if (selectedTaskIndex == taskIndex) {
            this.updateScreen(false);
        }
    },
    unCompleteTask: function(taskID) {
        taskController.unCompleteTask(taskID)
        this.updateScreen(true)
    },
    deleteTask: function(taskID) {
        taskController.deleteTask(taskID)

        const selectedTaskIndex = taskController.getTaskIndexByID(this.selectedTaskID)
        const taskIndex = taskController.getTaskIndexByID(taskID)
        
        if (selectedTaskIndex < taskIndex) {
            this.updateScreen(false)
        }
        else if (selectedTaskIndex > taskIndex) {
            // this.reduceSelectedTaskIDBy1()
            this.updateScreen(false)
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
        taskController.updateTaskDueDate(taskID, newDate)
        this.updateScreen(false)
    },
    updateTask(newTask) {
        const task = document.querySelector(`#${this.selectedTaskID}`)
        taskController.updateTask(newTask, this.selectedTaskID)
        this.updateScreen(true)
    },
    convertTaskIDtoTaskIndex(taskID) {
        const taskIndex = taskController.getTaskIndexByID(taskID)
        return taskIndex
    },
    convertTaskIDtoListIndex(taskID) {
        const listIndex = taskController.getListIndexByID(taskID)
        return listIndex
    },
    reduceSelectedTaskIDBy1() {
        this.selectedTaskID = "task" + (taskController.getTaskIndexByID(this.selectedTaskID) - 1) + "list" + this.selectedListID
    }
}

// Task Controller

const taskController = {
    lists: [],
    smartLists: [],
    listClass: class {
        tasks = []
        id;
        isSmartList;
        constructor(name) {
            this.name = name
            this.isSmartList = false
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
        newTask.id = `task${this.lists[listID].tasks.indexOf(newTask)}list${listID}`
        newTask.listID = listID
        return newTask
    },
    getTasks: function(listID) {
        return this.lists[listID].tasks
    },
    getListID: function(listName) {
        for (const list of this.lists) {
            if (list.name === listName) return list.id
        }
    },
    getTask: function(taskID, selectedListID) {
        const taskIndex = Number(taskID)
        return this.lists[selectedListID].tasks[taskIndex]
    },
    getLists: function() {
        return this.lists
    },
    getSmartLists() {
        return this.smartLists
    },
    getTaskByID(taskID) {
        const taskIndex = this.getTaskIndexByID(taskID)
        const listIndex = this.getListIndexByID(taskID)
        return this.lists[listIndex].tasks[taskIndex]
    },
    getTaskIndexByID(taskID) {
        
        let taskIndex = String(taskID).split(/(task|list)/)
        taskIndex = taskIndex[2]
        taskIndex = Number(taskIndex)
        
        return taskIndex
    },
    getListIndexByID(taskID) {
        let listIndex = String(taskID).split(/(task|list)/)
        listIndex = listIndex[4]
        listIndex = Number(listIndex)
        
        return listIndex
    },
    completeTask: function(taskID) {
        const task = this.getTaskByID(taskID)
        task.completed = true
    },
    unCompleteTask: function(taskID) {
        const task = this.getTaskByID(taskID)
        task.completed = false
    },
    deleteTask: function(taskID) {
        const taskIndex = this.getTaskIndexByID(taskID)
        const listIndex = this.getListIndexByID(taskID)
        this.lists[listIndex].tasks.splice(taskIndex, 1)
        this.updateTaskIds(listIndex)
    },
    updateTaskIds: function(listIndex) {
        let i = 0
        this.lists[listIndex].tasks.forEach((task) => {
            task.id = `task${i++}list${listIndex}`
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
    updateTaskDueDate: function(taskID, newDate) {
        const task = this.getTaskByID(taskID)
        task.dueDate = new Date(newDate)
    },
    updateTask: function (newTask, taskID) {
        const task = this.getTaskByID(taskID)
        if (newTask.name) task.name = newTask.name
        if (newTask.dueDate) task.dueDate = newTask.dueDate
        if (newTask.description) task.description = newTask.description
    },
    createSmartLists() {
        this.smartLists = []

        const smartListToday = new this.listClass("today")
        smartListToday.id = "smartListToday"
        smartListToday.name = "Today"
        smartListToday.isSmartList = true
        this.smartLists.push(smartListToday)
        
        const smartListTomorrow = new this.listClass("tomorrow")
        smartListTomorrow.id = "smartListTomorrow"
        smartListTomorrow.name = "Tomorrow"
        smartListTomorrow.isSmartList = true
        this.smartLists.push(smartListTomorrow)

        const smartListThisWeek = new this.listClass("thisWeek")
        smartListThisWeek.id = "smartListThisWeek"
        smartListThisWeek.name = "This Week"
        smartListThisWeek.isSmartList = true
        this.smartLists.push(smartListThisWeek)

        const smartListInbox = new this.listClass("inbox")
        smartListInbox.id = "smartListInbox"
        smartListInbox.name = "Inbox"
        smartListInbox.isSmartList = true
        this.smartLists.push(smartListInbox)

        for (const list of this.lists) {
            for (const task of list.tasks) {
                smartListInbox.tasks.push(task)

                const now = new Date()
                let dueDate = new Date(task.dueDate)
                const dayDifference = differenceInCalendarDays(dueDate, now)

                if (dayDifference < 8) smartListThisWeek.tasks.push(task)

                if (dayDifference == 0) smartListToday.tasks.push(task)
                else if (dayDifference == 1) smartListTomorrow.tasks.push(task)
            }
        }

        

        
    }

}


// Invocations

coordinator.initialize()