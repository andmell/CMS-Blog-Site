const registerUser = async (event) => { 
    event.preventDefault();
    const username = document.querySelector('#username').value.trim(); 
    const password = document.querySelector('#password').value.trim();
    if (username && password) {
        const serverResponse = await fetch('/api/users/', { 
            method: 'POST',
            body: JSON.stringify({ username, password }), 
            headers: { 'Content-Type': 'application/json' }, 
        });
        if (serverResponse.ok) {
            document.location.replace('/');
        } else {
            alert('There was a problem registering your account. Please contact an admin or try again later.'); 
        }
    }
};

document.querySelector('.button.is-link').addEventListener('submit', registerUser);