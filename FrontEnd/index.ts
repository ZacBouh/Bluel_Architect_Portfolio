export { }

//  RECUPERATION DES DONNEES

interface DataSet {
    [key: string]: JSON
}

interface Category {
    id: number,
    name: string

}

interface Works {
    id: string,
    title: string,
    imageUrl: URL,
    categoryId: number,
    userId: number,
    category: Category
}

const apiUrl = "http://localhost:5678/api/"

async function getData(apiUrl: string, dataType: string): Promise<JSON> {

    const response = await fetch(apiUrl + dataType)
    return await response.json()
}

const getDataSet = async function (dataTypes: Array<string>): Promise<DataSet> {
    const dataSet: DataSet = {}
    for (const dataType of dataTypes) {
        const data = await getData(apiUrl, dataType)
        dataSet[dataType] = data
    }
    return dataSet
}

const dataSet = await getDataSet(['categories', 'works'])
console.log(dataSet.categories, dataSet.works)

// TRI DES DONNEES

const filterProjects = function (projectType: string, data: JSON) {

}




