
import { loginUserApi } from "./api.js";

export function renderSignin({ loginElement, setToken, fetchCommentsAndRender}) {

  let isLoginMode = true;

  const renderForm = () => {
    const signinTemplate = `

    <div id="signin-form" class="add-form">
    ${isLoginMode ? '' : `<input type="text" id="signin-name-input" class="add-form-name" placeholder="Введите имя" value="" />
          <br><br>`}
          <input type="text" id="signin-login-input" class="add-form-name" placeholder="Введите логин" value="" />
          <br><br>
          <input type="password" id="signin-password-input" class="add-form-name" placeholder="Введите пароль" value="" />
          
          <div class="add-form-row">
            <button id="signin-button" class="add-form-button">${isLoginMode ?  `Войти` : `Зарегистрироваться`}</button>
          </div>
          <div class="add-form-row">
          <button id="toggle-button" class="add-form-button">Перейти ${isLoginMode ? `к регистрации` : `ко входу`}</button>
        </div>
        </div>

`;
    loginElement.innerHTML = signinTemplate;
    document.getElementById('toggle-button').addEventListener("click", () => {
      isLoginMode = !isLoginMode;
      renderForm();
    });


    document.getElementById('signin-button').addEventListener("click", () => {
      const login = document.getElementById('signin-login-input').value;
      const password = document.getElementById('signin-password-input').value;

      if (!login) {
        alert("Введите логин");
        return;
      }

      if (!password) {
        alert("Введите пароль");
        return;
      }
      loginUserApi({
        login,
        password
      })
        .then((user) => {
          console.log(user);
          setToken(`Bearer ${user.user.token}`);
          fetchCommentsAndRender();

        }).catch((error) => {
          alert(error.message);;
        });
    });
  };
  renderForm();
}