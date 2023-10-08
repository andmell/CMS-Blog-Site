
const pageRedirectLogin = async () => {
    location.href = `${window.location}login`
}


document.getElementById('login').addEventListener('click', pageRedirectLogin);