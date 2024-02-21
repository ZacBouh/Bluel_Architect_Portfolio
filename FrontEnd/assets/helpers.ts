// GLOBALS

export let user: User = { loggedIn: false }

export function checkUserLogin() {

    if (sessionStorage.getItem('token')) {
        user = {
            loggedIn: true,
            userId: sessionStorage.getItem('userId') ?? undefined,
            token: sessionStorage.getItem('token') ?? undefined
        }


    }
}


// TYPES
export interface Category extends JSON {
    id: number,
    name: string

}

export interface Work extends JSON {
    id: string,
    title: string,
    imageUrl: URL,
    categoryId: number,
    userId: number,
    category: Category
}

export interface User {
    loggedIn: boolean,
    userId?: string,
    token?: string
}


export const isCategory = function (categoriesArray: Array<any>): categoriesArray is Category[] {
    const isCategory = []
    for (const obj of categoriesArray) {
        if ('id' in obj && 'name' in obj) {

            isCategory.push(true)
        } else {
            isCategory.push(false)
        }

    }
    return !isCategory.includes(false)
}

//Helpers

export const createWorkFigure = function (work: Work, figcaptionContent: boolean = true, figcaptionId: boolean = false): HTMLElement {
    const workFigure = document.createElement('figure')

    workFigure.innerHTML = ` 
    <img src="${work.imageUrl}" alt="${work.title}">
    <figcaption ${figcaptionId ? `id="${work.id}"` : ""} >${figcaptionContent ? work.title : ""}</figcaption>
    `
    return workFigure
}

export async function importHTMLasString(url: URL) {
    const response = await fetch(url)
    const htmlContent = await response.text()
    return htmlContent
}

export const insertDiv = function (targetElement: HTMLElement, position: InsertPosition, divId: string): HTMLElement {
    const div = document.createElement('div')
    div.id = divId
    targetElement.insertAdjacentElement(position, div)
    return div
}

export const displayWorks = function (worksToDisplay: Work[] | undefined, target = document.querySelector('.gallery'), figcaptionContent: boolean = true, figcaptionId: boolean = false) {
    if (worksToDisplay !== undefined) {
        for (const work of worksToDisplay) {
            const workFigure = createWorkFigure(work, figcaptionContent, figcaptionId)

            target?.append(workFigure)
        }
    } else {
        console.log('no work to display !')
    }
}

export function displayMessage(message: string) {
    alert(message)
}

export const deleteHandler = (event: Event) => {
    deleteWork(event, user)
}


export async function deleteWork(event: Event, user: User) {
    const eventTarget = (event.target as HTMLButtonElement)
    const workToDeleteId = eventTarget.id === '' ? eventTarget.parentElement?.id : eventTarget.id
    console.log('delete event target : ', eventTarget)
    console.log('delete request : ', apiUrl + 'works/' + workToDeleteId)

    const response = await fetch(apiUrl + 'works/' + workToDeleteId, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'userId': Number(user.userId)
        })
    })
    console.log('delete response : ', response.status)

    switch (response.status) {
        case 204:
            console.log('work id : ' + workToDeleteId + ' deleted')
            eventTarget.removeEventListener('click', deleteHandler)
            eventTarget.parentElement?.remove()
            return false
        case 401:
        case 500:
            return response.status === 401 ? console.log('delete unauthorized') : console.log('unexpected behavior')
        default:
            console.log('unexpected server response')
            return false
    }

}

// PATH & URL
export const apiUrl = "http://localhost:5678/api/"

export const headerUrl = new URL(window.location.origin + '/assets/header')
export const footerUrl = new URL(window.location.origin + '/assets/footer')
export const modalEditUrl = new URL(window.location.origin + '/assets/modal-edit')
export const modalAddWorkUrl = new URL(window.location.origin + '/assets/modal-addWork')
