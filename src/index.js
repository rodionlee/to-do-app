import './style.css';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { daysInWeek, set } from 'date-fns';

// Screen Controller

const screenController = {
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
        this.addEventListenersToTasks()
    },
    createTaskElement: function(task) {
        const newTask = document.createElement("div")
        newTask.className = "task"
        newTask.id = task.id
        
        const newTaskCheckbox = document.createElement("input")
        newTaskCheckbox.type = "checkbox"
        newTaskCheckbox.className = "checkbox"
        newTask.appendChild(newTaskCheckbox)
        
        const newTaskDescription = document.createElement("p")
        newTaskDescription.className = "taskDescription"
        newTaskDescription.innerText = task.description
        newTask.appendChild(newTaskDescription)

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
        dueDateLabel.innerText = this.processDueDateInRelationToToday(task.dueDate)
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
            checkbox.addEventListener("change", (e) => {
                const taskID = e.path[1].id
                if (checkbox.checked === true)
                    coordinator.completeTask(taskID)
                else coordinator.unCompleteTask(taskID)
            })
        }

        const taskDeleteButtons = document.getElementsByClassName("taskDeleteButton")

        for (const deleteButton of taskDeleteButtons) {
            deleteButton.addEventListener("click", (e) => {
                const taskID = e.path[1].id
                coordinator.deleteTask(taskID)
            })
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
    initialize: function() {
        this.addNewList("My List")

        this.addNewTask("Buy milk", 0, new Date())
        this.addNewTask("Buy bananas", 0, new Date("12/20/2022"))
        this.addNewTask("Buy bread", 0, new Date("08/11/2022"))

        this.addNewList("My List 2")

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
    processAddNewTaskField: function(name, dueDate) {
        this.addNewTask(name, this.selectedListID, dueDate)
        screenController.clearAddNewTask()
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
    deleteList: function(listID) {
        taskController.deleteList(listID)
        const lists = taskController.getLists()
        screenController.displayLists(lists)
        screenController.addEventListenersToLists()
        if (listID == this.selectedListID) this.selectList(0)
        else if (this.selectedListID < listID) this.selectList(this.selectedListID)
        else if (this.selectedListID > listID) {
            this.selectedListID--
            this.selectList(this.selectedListID)
        }
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
        constructor(description, listID, dueDate) {
            this.description = description
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
        // newTask.dueDate = new Date("2018-01-01")
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
}

// Invocations

coordinator.initialize()




