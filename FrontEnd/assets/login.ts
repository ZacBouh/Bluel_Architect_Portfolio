import { importHTMLasString, displayMessage, apiUrl, headerUrl, footerUrl } from "./helpers"

//Types

interface UserLogin {
    'email': string,
    'password': string
}

// importer le header et le footer au chargement de la page

window.onload = async () => {
    const htmlHeader = await importHTMLasString(headerUrl)
    const htmlFooter = await importHTMLasString(footerUrl)
    document.querySelector('body')?.insertAdjacentHTML('afterbegin', htmlHeader)
    document.querySelector('body')?.insertAdjacentHTML('beforeend', htmlFooter)

    //Mettre en gras le lien login dans la barre de navigation
    const navLinksList = document.querySelector('header > nav > ul')
    const loginLinkXPATH = document.evaluate("//a[text()='login']", navLinksList as Node);
    const loginLink = loginLinkXPATH.iterateNext();
    (loginLink as HTMLElement).style.fontWeight = '600'
}

const logInHandler = async function (event: Event) {
    event.preventDefault()

    const form = (document.querySelector('.loginForm') as HTMLFormElement)
    const nameInput = (document.getElementById('name') as HTMLInputElement)
    const passwordInput = (document.getElementById('password') as HTMLInputElement)

    //validation des input

    if (form.checkValidity()) {
        const nameInputValue = nameInput.value.trim()
        const passwordInputValue = passwordInput.value.trim()

        const postData = {} as UserLogin
        postData.email = nameInputValue
        postData.password = passwordInputValue

        console.log('Request body : ', postData)
        if (await login(postData)) window.location.replace('/index.html')

    } else {
        form.reportValidity()
    }

}

const login = async function (postData: UserLogin) {
    const response = await fetch(apiUrl + 'users/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })

    const userData = await response.json()
    const code = response.status

    if (code === 404 || code === 401) {
        displayMessage(`Erreur dans l'identifiant ou le mot de passe`)
        return false
    } else if (code === 200) {
        sessionStorage.setItem('userId', userData.userId)
        sessionStorage.setItem('token', userData.token)
        console.log('token is : ', sessionStorage.getItem('token'))
        return true
    }

    console.log('response coode : ', code)
}

// ADDEVENT LISTENERS
const loginButton = document.getElementById('loginButton')
loginButton?.addEventListener('click', logInHandler)
