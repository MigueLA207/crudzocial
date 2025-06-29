const toLogin = document.getElementById('toLogin');
const toRegister = document.getElementById('toRegister');
const btnRegister = document.getElementById('btnRegister');
const btnLogin = document.getElementById('btnLogin');



btnRegister.addEventListener("click",registerUser);
btnLogin.addEventListener("click",loginUser);

toLogin.addEventListener("click", () => {
  document.getElementById("divFormRegister").classList.add("d-none");
  document.getElementById("divFormLogin").classList.remove("d-none");
});

toRegister.addEventListener("click", () => {
  document.getElementById("divFormLogin").classList.add("d-none");
  document.getElementById("divFormRegister").classList.remove("d-none");
});

function registerUser(){
  const rName = document.getElementById("rFullName");
  const rEmail = document.getElementById("rEmail");
  const rPassword = document.getElementById("rPassword");

  let users = JSON.parse(localStorage.getItem("users")) || [];
 
  users.push({
    fullName:rName.value,
    email:rEmail.value,
    password:rPassword.value,
    notes:[],
    images:[]
  });

  localStorage.setItem("users",JSON.stringify(users)); 
  document.getElementById("formRegister").reset();

  document.getElementById("divFormRegister").classList.add("d-none");
  document.getElementById("divFormLogin").classList.remove("d-none");
}

function loginUser(){
  const lEmail = document.getElementById("lEmail");
  const lPassword = document.getElementById("lPassword");

  let usersRegistered = JSON.parse(localStorage.getItem("users"));

  if(lEmail && lPassword){
    let found = false;

    for (const id in usersRegistered){
      const emailRegistered = usersRegistered[id].email;
      const passwordRegistered = usersRegistered[id].password;
      if(lEmail.value == emailRegistered && lPassword.value == passwordRegistered){
        found = true;
        lEmail.classList.add("is-valid");
        lPassword.classList.add("is-valid");

        setTimeout(() =>{
          sessionStorage.setItem("auth","true");
          window.location = "main.html";
        },500);
        localStorage.setItem("userId",lEmail.value);
        break;
      };
    };
    if(!found){
      lEmail.classList.add("is-invalid");
      lPassword.classList.add("is-invalid");
    }
  }else{
    alert("Rellene ps los campos animal");
  }
  // document.getElementById("formLogin").reset();
}






