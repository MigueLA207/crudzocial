let authenticated = sessionStorage.getItem("auth")

if (authenticated != "true"){
    window.location = "index.html"
} 