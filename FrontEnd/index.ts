import { apiUrl, importHTMLasString, Work, Category, isCategory, insertDiv, user, displayWorks, modalEditUrl, checkUserLogin, deleteHandler, modalAddWorkUrl } from "./assets/helpers"


export { }



//  TYPES

interface DataSet {
    'works'?: Work[]
    "categories"?: Category[]
}



// GENERAL




// check si l'utilisateur est connecté 

checkUserLogin()

console.log("userLoggedIn : ", user.loggedIn)

// IMPORT DES DONNEES


async function getData(apiUrl: string, dataType: string): Promise<Category[] | Work[]> {

    const response = await fetch(apiUrl + dataType)
    return await response.json()
}

const getDataSet = async function (dataTypes: Array<'works' | 'categories'>): Promise<DataSet> {
    const dataSet: DataSet = {}
    for (const dataType of dataTypes) {
        const data = await getData(apiUrl, dataType)
        if (isCategory(data)) {
            dataSet.categories = data
        } else {
            dataSet.works = data
        }
    }
    return dataSet
}

const dataSet = await getDataSet(['categories', 'works'])

const categoriesSet = dataSet.categories?.map((category) => category.name)
const worksSet = dataSet.works

console.log('Set of categories : ' + categoriesSet)

// TRI DES DONNEES

let displayedWorks = dataSet.works

const filterProjects = function (projectType: string, data: Array<Work>) {
    const works = Array.from(data)
    const filteredWorks = works.filter((work) => work.category.name === projectType)
    return filteredWorks
}

const filterHandler = function (event: Event) {
    if (dataSet.works !== undefined && event.target) {
        const target = event.target as HTMLButtonElement

        (document.querySelector('.filterButton.clickedButton'))?.classList.remove('clickedButton')

        target.classList.add('clickedButton');


        const projectType = target.id

        if (projectType === 'tous') {
            displayedWorks = dataSet.works
        } else {
            displayedWorks = filterProjects(projectType, dataSet.works)
        }

        (document.querySelector('.gallery') as HTMLElement).innerHTML = ''
        displayWorks(displayedWorks)

        console.log('displayed works : ', displayedWorks)
    }
}



//Afficher les filtres

if (categoriesSet) {
    const filtersContainer = document.createElement('div')
    filtersContainer.id = 'filtersContainer'
    const button = document.createElement('button')
    button.id = 'tous'
    button.textContent = 'Tous'
    button.classList.add('filterButton', 'clickedButton')

    button.addEventListener('click', filterHandler)

    filtersContainer.append(button)

    for (const category of categoriesSet) {
        const button = document.createElement('button')
        button.id = category
        button.textContent = category
        button.classList.add('filterButton')

        button.addEventListener('click', filterHandler)

        filtersContainer.append(button)
    }

    document.querySelector('.gallery')?.insertAdjacentElement('beforebegin', filtersContainer)
}

// AFFICHER LES PROJETS
displayWorks(displayedWorks)


//MODIFIER LES PROJETS

//ajouter le bouton modifier et remplacer login par logout


const startEditing = async function (event: Event) {
    () => console.log('start editing')

    event.target?.removeEventListener('click', startEditing)

    const body = document.querySelector('body')
    const modalContainer = body ? insertDiv(body, 'beforebegin', 'modalContainer') : undefined
    const modal = modalContainer ? insertDiv(modalContainer, 'afterbegin', 'modal') : undefined
    const modalHtmlContent = await importHTMLasString(modalEditUrl)
    modal?.insertAdjacentHTML('afterbegin', modalHtmlContent)

    const modalGallery = document.getElementById('edit-gallery')
    displayWorks(worksSet, modalGallery, false, true)

    function closeEditHandler(event: Event) {
        const eventTarget = event.target as HTMLButtonElement
        eventTarget.removeEventListener('click', closeEditHandler)
        document.getElementById('editButton')?.addEventListener('click', startEditing)

        modalContainer?.remove()
    }

    async function addWorkHandler(event: Event) {
        const targetButton = event.target
        targetButton?.removeEventListener('click', addWorkHandler)
        const modalContent = document.getElementById('modal-content')
        if (modalContent) modalContent.innerHTML = ''
        const addWorkModalHtmlContent = await importHTMLasString(modalAddWorkUrl)
        modalContent?.insertAdjacentHTML('afterbegin', addWorkModalHtmlContent)
        document.querySelector('label[for="add-work-file"]')?.addEventListener('click', selectFileHandler)

    }

    function selectFileHandler(event: Event) {
        console.log((event.target as HTMLLabelElement).getAttribute('for'))
    }

    const closeEditButton = document.getElementById('edit-close-button')
    closeEditButton?.addEventListener('click', closeEditHandler)

    const figcaptions = document.querySelectorAll('#edit-gallery figcaption, #edit-gallery figcaption i')
    for (const figcaption of figcaptions) {
        figcaption.addEventListener('click', deleteHandler)
    }

    document.getElementById('add-picture-button')?.addEventListener('click', addWorkHandler)

    return modalContainer
}


//Ajout du bouton modifier si l'utilisateur est connecté

if (user.loggedIn) {

    const portfolioTitle = document.querySelector('#portfolio h2')
    const buttonHtml = `
        <button id="editButton"><i class="fa-regular fa-pen-to-square"></i>modifier</button>
    `
    portfolioTitle?.insertAdjacentHTML('beforeend', buttonHtml)
    const editButton = document.getElementById('editButton')

    editButton?.addEventListener('click', startEditing)

}


