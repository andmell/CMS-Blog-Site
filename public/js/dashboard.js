const dashboard = async () => {
    const response = await fetch('/api/dashboard', {
        method: 'GET',
        headers: {'Content-Type': 'application/javascript' },
    });

    if (response.ok) {
        document.location.pathname =("/api/dashboard")
    } else {
        alert('you fucked up somewhere')
    }
};

document.querySelector('#dashboard').addEventListener('click', dashboard);