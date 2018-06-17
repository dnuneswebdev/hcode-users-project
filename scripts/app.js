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

//SELECTORS USING FOREACH WITH "NAME" ATTRIBUTE
let fields = document.querySelectorAll('#form-user-create [name]');

fields.forEach((field, index) => {
  if(field.name == 'gender' && field.checked) {
    user[field.name] = field.value //cria o JSON com o gender
  } else {
    user[field.name] = field.value; // cria o restante do JSON
  }
});

console.log(user)
