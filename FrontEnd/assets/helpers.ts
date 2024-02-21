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

export const createWorkFigure = function (work: Work): HTMLElement {
    const workFigure = document.createElement('figure')
    workFigure.innerHTML = ` 
    <img src="${work.imageUrl}" alt="${work.title}">
    <figcaption>${work.title}</figcaption>
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

export const displayWorks = function (worksToDisplay: Work[] | undefined, target = document.querySelector('.gallery')) {
    if (worksToDisplay !== undefined) {
        for (const work of worksToDisplay) {
            const workFigure = createWorkFigure(work)

            target?.append(workFigure)
        }
    } else {
        console.log('no work to display !')
    }
}

export function displayMessage(message: string) {
    alert(message)
}

// PATH & URL
export const apiUrl = "http://localhost:5678/api/"

export const headerUrl = new URL(window.location.origin + '/assets/header')
export const footerUrl = new URL(window.location.origin + '/assets/footer')