export function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") && localStorage.getItem("isLoggedIn") == "true";
}

export function logout() {
    localStorage.setItem("isLoggedIn", false);
    localStorage.removeItem("user");
}
