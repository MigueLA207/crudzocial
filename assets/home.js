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
const imageneeee = document.getElementById('imageneeee')
const addImageContainer = document.getElementById('addImage')
const btnImages = document.getElementById('images');
const imageInputUrl = document.getElementById("imageInputUrl");
const uploadImageBtn = document.getElementById("uploadImageBtn");
const galleryContainer = document.getElementById("galleryContainer");


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
    updateUserForm.classList.add("d-none");
    addImageContainer.classList.add('d-none');
    document.getElementById('logsTable').classList.add('d-none');
  
    imageInputUrl.classList.add('d-none');
    document.getElementById('gallerySection').classList.add('d-none');
}

//añadir imagenes
function renderGallery() {
  galleryContainer.innerHTML = "";
  const images = userComponents.images || [];

  images.forEach((img, i) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";
    col.innerHTML = `
      <div class="card">
        <img src="${img}" class="card-img-top" alt="Imagen ${i + 1}" width="100" height="200">
        <div class="card-body text-center">
          <button class="btn btn-danger btn-sm" onclick="deleteImage(${i})">Eliminar</button>
        </div>
      </div>
    `;
    galleryContainer.appendChild(col);
  });
}

function deleteImage(index) {
  userComponents.images.splice(index, 1);
  const userIndex = usersRegistered.findIndex(user => user.email === activeUser);
  if (userIndex !== -1) {
    usersRegistered[userIndex].images = userComponents.images;
    localStorage.setItem("users", JSON.stringify(usersRegistered));
  }
  renderGallery();
  addLogs("Eliminó una imagen", () => {});
}

uploadImageBtn.addEventListener("click", () => {
  const imageUrl = imageInputUrl.value.trim();
  if (!imageUrl || !imageUrl.startsWith("http")) {
    alert("Por favor, ingrese una URL válida de imagen.");
    return;
  }

  addLogs("Subió una nueva imagen", () => {
    userComponents.images.push(imageUrl);
    const userIndex = usersRegistered.findIndex(user => user.email === activeUser);
    if (userIndex !== -1) {
      usersRegistered[userIndex].images = userComponents.images;
      localStorage.setItem("users", JSON.stringify(usersRegistered));
    }
    imageInputUrl.value = "";
    renderGallery();
  });
});

renderGallery();

function showImages(){
    clearSections();
    renderInfoPage('Añade ','Gestiona tus imágenes, notas y logs desde aquí de forma rápida.');
    addImageContainer.classList.remove('d-none');
    imageInputUrl.classList.remove('d-none')
    mainTitle.classList.remove('d-none')
    document.getElementById('gallerySection').classList.remove('d-none');


    bsOffcanvas.hide();
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

function showLogs(){
    clearSections();
    renderInfoPage('Historial', 'Aquí puedes ver tus acciones realizada en la pagina');

    document.getElementById('logsTable').classList.remove('d-none')


    bsOffcanvas.hide();
}

function logOut(){
    localStorage.removeItem("auth"); 
    window.location = "register.html"; 
}



openUpdateUser.addEventListener("click",loadDataUpdate);
applyUpdate.addEventListener("click", () => addLogs("Actualizó datos del usuario", applyUpdateValues));
btnLogOut.addEventListener("click", () => addLogs("Cierre de Sesión",logOut));
btnImages.addEventListener("click",showImages);
btnLogs.addEventListener("click",renderLogsTable)
