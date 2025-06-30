let authenticated = localStorage.getItem("auth")

if (authenticated != "true"){
    window.location = "register.html";
};