//SELECTORS ONE BY ONE
// let nome = document.querySelector('#exampleInputName');
// let gender = document.querySelectorAll('#form-user-create [name=gender]:checked');
// let birth = document.querySelector('#exampleInputBirth');
// let country = document.querySelector('#exampleInputCountry');
// let email = document.querySelector('#exampleInputEmail');
// let password = document.querySelector('#exampleInputPassword');
// let photo = document.querySelector('#exampleInputFile');
// let admin = document.querySelector('#exampleInputAdmin');
////////////////////////////////////////////////////////////////////////////

//INITIALIZE JSON
let user = {};

//FORM SELECTOR WITH "NAME" ATTRIBUTE
let fields = document.querySelectorAll('#form-user-create [name]');

//GET THE FORM, CREATE THE JSON FILE AND CALL ADDUSER FUNCTION
document.getElementById('form-user-create').addEventListener('submit', e => {
  e.preventDefault();

  //LOOP THROUGH ALL THE SELECTORS IN THE FORM WITH "NAME" ATTRIBUTE AND FILTER GENDER
  fields.forEach((field, index) => {
    if(field.name == 'gender' && field.checked) {
      user[field.name] = field.value //CREATE THE JSON WITH THE GENDER
    } else {
      user[field.name] = field.value; //CREATE THE REST OF THE JSON
    }
  });
    addUser(user);
});

//CREATE THE USER INSIDE THE TABLE DIV
function addUser(user) {
  let tr = document.createElement('tr');

  tr.innerHTML = `
    <tr>
    <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>${user.admin}</td>
    <td>${user.birth}</td>
    <td>
      <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
    </td>
  </tr>
  `
  document.getElementById('table-users').appendChild(tr);
  console.log(user)
}
