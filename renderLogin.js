


export function renderSignin({ appElement }) {

  const signinTemplate = `
  <div class="container">
    <div id="signin-form" class="add-form">
          <input type="text" id="signin-login-input" class="add-form-name" placeholder="Введите логин" value="" />
          <br><br>
          <input type="password" id="signin-password-input" class="add-form-name" placeholder="Введите пароль" value="" />
          
          <div class="add-form-row">
            <button id="signin-button" class="add-form-button">Войти</button>
          </div>
        </div>
</div>
`;

  appElement.innerHTML = signinTemplate;
  const buttonLogin = document.getElementById('signin-button');
  buttonLogin.addEventListener("click", () => {
    const inputLogin = document.getElementById('signin-login-input');
      const inputPassword = document.getElementById('signin-password-input');


        if (!login) {
          alert("Введите логин");
          return;
        }

        if (!password) {
          alert("Введите пароль");
          return;
        }
  });
  //  loginUserApi({ login, password });
}