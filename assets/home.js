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

const containerMain = document.getElementById('containerMain');
const userName = document.getElementById('userSpan')
const btnLogOut = document.getElementById('logOut');
const userInitials = document.getElementById('initialsUser');
const openUpdateUser = document.getElementById('openUpdateUser');
const updateUserForm = document.getElementById('formUpdate');
const applyUpdate = document.getElementById('applyUpdate');
const btnLogs = document.getElementById('logs');


let activeUser = localStorage.getItem("userId");
let usersRegistered = JSON.parse(localStorage.getItem("users")) || [];
let userComponents = usersRegistered.find(user => user.email === activeUser);
let idLog = 0;

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
};

function renderInfoPage(context,textContext){
    const mainTitle = document.getElementById('mainTitle');
    const mainText = document.getElementById('mainText');

    mainTitle.textContent = context;
    mainText.textContent = textContext;
}

function clearSections() {
    // Oculta el formulario de actualización si está visible
    updateUserForm.classList.add("d-none");
    // Oculta la tabla de logs si está visible
    document.getElementById('logsTable').classList.add('d-none');
    // Puedes ocultar otras secciones que vayas agregando aquí
}


function loadDataUpdate(){
    clearSections();
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
    const userLogs = userComponents.logs || [];

    const fullNameUpdate = document.getElementById('newFullNames');
    const emailUpdate = document.getElementById("newEmail");
    const passwordUpdate = document.getElementById("newPassword");

    const updatedUser = {
        fullName : fullNameUpdate.value,
        email : emailUpdate.value,
        password : passwordUpdate.value,
        notes:userNotes,
        images:userImages,
        logs: userLogs 
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

function addLogs(actionDescription, callback){
    // Con esto ejecutamos la accion real
    callback();
    
    idLog = userComponents.logs.length + 1;

    let date = new Date();
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    let year = date.getFullYear();
    let hour = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');

    let formatDate = `${day}/${month}/${year}`;
    let formatHour = `${hour}:${minutes}`;

    userComponents.logs.push({
        id: idLog,
        actionLog: actionDescription,
        dateLog: formatDate,
        hourLog: formatHour
    });

    const userIndex = usersRegistered.findIndex(user => user.email === activeUser);
    if (userIndex !== -1) {
        usersRegistered[userIndex].logs = userComponents.logs;
        localStorage.setItem("users", JSON.stringify(usersRegistered));
    }
}

function renderLogsTable(){
    clearSections();
    document.getElementById('logsTable').classList.remove('d-none');
    const logsTableBody = document.getElementById('logsBody')
    logsTableBody.innerHTML = ``;
    userComponents.logs.forEach(user => {
        logsTableBody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.actionLog}</td>
                <td>${user.dateLog}</td>
                <td>${user.hourLog}</td>
            </tr>
        `
    }); 

    renderInfoPage('Registro de actividad','Consulta aquí las actividades recientes de tu cuenta.')
    bsOffcanvas.hide();
};


function logOut(){
    localStorage.removeItem("auth"); 
    window.location = "register.html"; 
}



openUpdateUser.addEventListener("click",loadDataUpdate);
applyUpdate.addEventListener("click", () => addLogs("Actualizó datos del usuario", applyUpdateValues));
btnLogOut.addEventListener("click", () => addLogs("Cierre de Sesión",logOut));
btnLogs.addEventListener("click",renderLogsTable)









