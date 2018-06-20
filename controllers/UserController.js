class UserController {

  constructor(formId, tableId) {

    this.formEl = document.getElementById(formId);
    this.tableEl = document.getElementById(tableId);

    this.onSubmit();
  }

  onSubmit() {
  this.formEl.addEventListener('submit', e => {
    e.preventDefault();

    let values = this.getValues();

    this.getPhoto().then(
    (content) => {
      values.photo = content;
      this.addUser(values);
    }, 
    (e) => {
      console.error(e);
    })

    });
  }

  getValues() {
  let user = {};

  //LOOP THROUGH ALL THE SELECTORS IN THE FORM WITH "NAME" ATTRIBUTE AND FILTER GENDER
  [...this.formEl.elements].forEach((field, index) => { //SPREAD OPERATOR [...]
    if(field.name == 'gender' && field.checked) {
      user[field.name] = field.value //CREATE THE JSON WITH THE GENDER

    } else if(field.name == 'admin') {
      user[field.name] = field.checked;
    }
      else {
      user[field.name] = field.value; //CREATE THE REST OF THE JSON
    }

  });

    return new User(
    user.name, 
    user.gender, 
    user.birth, 
    user.country, 
    user.email, 
    user.password, 
    user.photo, 
    user.admin
    );
  }//CLOSING GET VALUES

  getPhoto() {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();

      let elements = [...this.formEl.elements].filter(item => {
        if(item.name === 'photo') {
          return item;
        }
      });
  
      let file = elements[0].files[0]
  
      fileReader.onload = ()=> {
        resolve(fileReader.result);
      }

      fileReader.onerror = (e) => {
        reject(e);
      }
  
      if(file) {
        fileReader.readAsDataURL(file);
      } else {
        resolve('../binding-dark.png'); //se nao tiver imagem, nao de erro e use a padrao
      }
    })

  }

  //CREATE THE USER INSIDE THE TABLE DIV
  addUser(objectUser) {
    let tr = document.createElement('tr');

    tr.innerHTML =  `
    <td><img src="${objectUser.photo}" alt="User Image" class="img-circle img-sm"></td>
    <td>${objectUser.name}</td>
    <td>${objectUser.email}</td>
    <td>${(objectUser.admin) ? 'Yes' : 'No'}</td>
    <td>${objectUser.birth}</td>
    <td>
      <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
    </td>
  `
  this.tableEl.appendChild(tr)
}

}
