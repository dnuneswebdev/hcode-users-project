class UserController {

  constructor(formIdCreate, formIdUpdate, tableId) {

    this.formEl = document.getElementById(formIdCreate);
    this.formUpdateEl = document.getElementById(formIdUpdate);
    this.tableEl = document.getElementById(tableId);

    this.onSubmit();
    this.onEdit();
    this.selectAll();
  }

  onEdit() {
    document.querySelector('#box-user-update .btn-cancel').addEventListener('click', e => {
      this.showPanelCreate();
    });

    this.formUpdateEl.addEventListener('submit', e => {
      e.preventDefault();
      let btn = this.formUpdateEl.querySelector('[type=submit]')
      btn.disabled = true;
      let values = this.getValues(this.formUpdateEl);
      let index = this.formUpdateEl.dataset.trIndex
      let tr = this.tableEl.rows[index];
      let userOld = JSON.parse(tr.dataset.user);
      let result = Object.assign({}, userOld, values); // cria um novo objeto

    this.getPhoto(this.formUpdateEl).then(
      (content) => {
        if(!values.photo) {
          result._photo = userOld._photo;
        } else {
          result._photo = content;
        }

      let user = new User();

      user.loadFromJson(result);

      user.save();

      this.getTr(user, tr);
  
      this.updateCount();
  
      this.formUpdateEl.reset()
  
      btn.disabled = false;

      this.showPanelCreate();
      },
      (e) => {
        console.error(e);
      });
   
    });
  }

  onSubmit() {
  this.formEl.addEventListener('submit', e => {
    e.preventDefault();

    let btn = this.formEl.querySelector('[type=submit]');

    btn.disabled = true;

    let values = this.getValues(this.formEl);

    if(!values) return false;

    this.getPhoto(this.formEl).then(
    (content) => {
      values.photo = content;
      values.save();
      this.addUser(values);
      this.formEl.reset();
      btn.disabled = false;
    }, 
    (e) => {
      console.error(e);
    })

    });
  }

  getValues(formEl) {
  let user = {};
  let isValid = true;

  //LOOP THROUGH ALL THE SELECTORS IN THE FORM WITH "NAME" ATTRIBUTE AND FILTER GENDER
  [...this.formEl.elements].forEach((field, index) => { //SPREAD OPERATOR [...]
    if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
      field.parentElement.classList.add('has-error');
      isValid = false;
    }

    if(field.name == 'gender' && field.checked) {
      user[field.name] = field.value //CREATE THE JSON WITH THE GENDER

    } else if(field.name == 'admin') {
      user[field.name] = field.checked;
    }
      else {
      user[field.name] = field.value; //CREATE THE REST OF THE JSON
    }

  });

    if(!isValid) {
      return false;
    }

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

  getPhoto(formEl) {
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

  selectAll() {
    let users = User.getUsersStorage();
    users.forEach(dataUser => {
       let user = new User();
      user.loadFromJson(dataUser);
      this.addUser(user);
    })
  }

  //CREATE THE USER INSIDE THE TABLE DIV
  addUser(objectUser) {   
    let tr = this.getTr(objectUser);
    this.tableEl.appendChild(tr);
    this.updateCount();
  }

  getTr(objectUser, tr = null) {
    if(tr === null) tr = document.createElement('tr');

    tr.dataset.user = JSON.stringify(objectUser);

    tr.innerHTML =  `
    <td><img src="${objectUser.photo}" alt="User Image" class="img-circle img-sm"></td>
    <td>${objectUser.name}</td>
    <td>${objectUser.email}</td>
    <td>${(objectUser.admin) ? 'Yes' : 'No'}</td>
    <td>${Utils.dateFormat(objectUser.register)}</td>
    <td>
      <button type="button" class="btn btn-edit btn-primary btn-xs btn-flat">Editar</button>
      <button type="button" class="btn btn-delete btn-danger btn-xs btn-flat">Excluir</button>
    </td>
  `;

    this.addEventsTr(tr);

    return tr;
  }

  addEventsTr(tr) {
    tr.querySelector('.btn-delete').addEventListener('click', e => {
      if(confirm('Deseja realmente excluir?')) {
        let user = new User();
        user.loadFromJson(JSON.parse(tr.dataset.user));
        user.remove();
        tr.remove();
        this.updateCount();
      }
    })

    tr.querySelector('.btn-edit').addEventListener('click', e => {
      let json = JSON.parse(tr.dataset.user);
        
      this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
  
      for(let name in json) {
        let field = this.formUpdateEl.querySelector('[name=' + name.replace("_", "") + ']');
  
        if(field) {
          switch(field.type) {
            case 'file':
            continue;
            break;
  
            case 'radio':
            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] +"]");
            field.checked = true;
            break;
  
            case 'checkbox':
            field.checked = json[name];
            break;
  
            default: 
            field.value = json[name];
          }
        }
      }

      this.formUpdateEl.querySelector('.photo').src = json._photo;
  
      this.showPanelUpdate();
    });
  }

  showPanelCreate() {
    document.querySelector('#box-user-create').style.display = 'block';
    document.querySelector('#box-user-update').style.display = 'none';
  }

  showPanelUpdate() {
    document.querySelector('#box-user-create').style.display = 'none';
    document.querySelector('#box-user-update').style.display = 'block';
  }

  updateCount() {
    let numberUsers = 0;
    let numberAdmin = 0;

    [...this.tableEl.children].forEach(tr => {
      numberUsers++;
      let user = JSON.parse(tr.dataset.user);

      if(user._admin) numberAdmin++;
    });

    document.querySelector('#number-users').innerHTML = numberUsers;
    document.querySelector('#number-users-admin').innerHTML = numberAdmin;
  }

}
