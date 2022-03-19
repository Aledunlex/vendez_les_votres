let loginDisplay;

const loginDisplaySetup = () => {
    loginDisplay = document.getElementById('loginDisplay');
    getUserLogin();
}
window.addEventListener('DOMContentLoaded', loginDisplaySetup);

const getUserLogin = async () => {
    const requestOptions = {
                             method :'GET',
                           };
    const response = await fetch('/user/me', requestOptions);
    let displayString;
    if (response.ok) {
        const user = await response.json();
        displayString = user.login;
    }
    else displayString = "visiteur";
    loginDisplay.textContent = `Bienvenue, ${displayString}`;
}