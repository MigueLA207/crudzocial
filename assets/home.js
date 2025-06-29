// {
//     fullName:rName.value,
//     email:rEmail.value,
//     password:rPassword.value,
//     notes:[],
//     images:[]
//   }

//Instancia del sidebar
const sidebarMenu = document.getElementById('sidebarMenu');
const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(sidebarMenu);

const userName = document.getElementById('userSpan')
const btnLogOut = document.getElementById('logOut');
const userInitials = document.getElementById('initialsUser');
const openUpdateUser = document.getElementById('openUpdateUser');
const updateUserForm = document.getElementById('formUpdate');
const applyUpdate = document.getElementById('applyUpdate');

openUpdateUser.addEventListener("click",loadDataUpdate);
applyUpdate.addEventListener("click", applyUpdateValues);
btnLogOut.addEventListener("click", logOut);

let activeUser = localStorage.getItem("userId");
let usersRegistered = JSON.parse(localStorage.getItem("users")) || [];
let userComponents = usersRegistered.find(user => user.email === activeUser);


if (userComponents) {
    let nombreCompleto = userComponents.fullName;
    userName.textContent = nombreCompleto;
    let iniciales = nombreCompleto
        .toUpperCase()
        .split(" ")
        .slice(0, 2)
        .map(p => p[0])
        .join("");
    userInitials.textContent = iniciales;
} else {
    userName.textContent = "Usuario desconocido";
    userInitials.textContent = "NN";
}


function loadDataUpdate(){
    updateUserForm.classList.remove("d-none");
    document.getElementById("newFullNames").value = userComponents.fullName;
    document.getElementById("newEmail").value = userComponents.email;
    document.getElementById("newPassword").value = userComponents.password;

    bsOffcanvas.hide(); 
}

function applyUpdateValues(){
    // Mantenemos las notas y las imagenes del usario tal cual
    const userNotes = userComponents.notes || [];
    const userImages = userComponents.images || [];

    const fullNameUpdate = document.getElementById('newFullNames');
    const emailUpdate = document.getElementById("newEmail");
    const passwordUpdate = document.getElementById("newPassword");

    const updatedUser = {
        fullName : fullNameUpdate.value,
        email : emailUpdate.value,
        password : passwordUpdate.value,
        notes:userNotes,
        images:userImages 
    };

    const userIndex = usersRegistered.findIndex(user => user.email === activeUser);
    if(userIndex !== -1){
        usersRegistered[userIndex] = updatedUser;
        localStorage.setItem("users",JSON.stringify(usersRegistered));

        activeUser = updatedUser.email;
        localStorage.setItem("userId", activeUser);

        userComponents = updatedUser;
        userName.textContent = updatedUser.fullName;
        let iniciales = updatedUser.fullName
            .toUpperCase()
            .split(" ")
            .slice(0, 2)
            .map(p => p[0])
            .join("");
        userInitials.textContent = iniciales;
        alert("Datos actualizados correctamente");

        updateUserForm.classList.add("d-none");
    }else{
        alert("No se encontro usuario")
    };




};


function logOut(){
  sessionStorage.setItem("auth", false);
  window.location = "/index.html";
};











