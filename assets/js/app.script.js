const listsContainer = document.querySelector('[data-lists-days]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const btnAddDay = document.getElementById('btn-add-day');
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listCountElement = document.querySelector('[data-list-count]')
const listTitleElement = document.querySelector('[data-list-title]')
const taskContainer = document.querySelector('[data-tasks]')
const taksTemplate = document.getElementById('task-template')
const clearCompleteTaskButton = document.querySelector('[data-clear-complete-tasks-button]')
// create task
const addTaskButton = document.getElementById('btn-add-planned')
const newTaskInput = document.querySelector('[data-new-task-input]')
const newTaskForm = document.querySelector('[data-new-task-form]')



const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

listsContainer.addEventListener('click', function (e) {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId
        saveAndRender()
    }

})

taskContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() == 'input') {
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.completed = e.target.checked
        save()
        renderTaskCountCount(selectedList)
    }

})

clearCompleteTaskButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.completed)
    saveAndRender()
})


deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()

})

newListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput.value
    if (listName == null || listName === '') return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})

newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if (taskName == null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    console.log(taskName)
    selectedList.tasks.push(task)
    saveAndRender()
})

addTaskButton.addEventListener('click', e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if (taskName == null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    console.log(taskName)
    selectedList.tasks.push(task)
    saveAndRender()
})

btnAddDay.addEventListener('click', e => {
    e.preventDefault()
    const listName = newListInput.value
    if (listName == null || listName === '') return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})

function createList(name) {
    return {
        id: Date.now().toString(),
        day: name,
        tasks: []
    }

}

function createTask(name) {
    return {
        id: Date.now().toString(),
        day: name,
        completed: false
    }

}

addTaskButton.addEventListener('click', function () {})

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)

}

function saveAndRender() {
    save()
    render()

}

function render() {
    clearElement(listsContainer)
    renderLists()
    const selectedList = lists.find(list => list.id === selectedListId)
    // console.log(selectedListId) 
    if (selectedListId == null) {
        listDisplayContainer.style.display = 'none'
    } else {
        listDisplayContainer.style.display = ''
        listTitleElement.innerHTML = selectedList.day
        renderTask(selectedList)
        clearElement(taskContainer)
        renderTask(selectedList)
        renderTaskCountCount(selectedList)
    }
}


function renderTask(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taksTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.completed
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.day)
        taskContainer.appendChild(taskElement)
    })
}

function renderTaskCountCount(selectedList) {
    const incompleteTask = selectedList.tasks.filter(task => !task.completed).length
    const taskString = incompleteTask === 1 ? "task" : "tasks"
    listCountElement.innerHTML = `${incompleteTask} ${taskString} remeaning`
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add('list-day')
        listElement.innerText = list.day
        if (list.id === selectedListId) {
            listElement.classList.add('active-list')
        }
        listsContainer.appendChild(listElement)
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }

}


render()