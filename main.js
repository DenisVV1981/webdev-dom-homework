"use strict";
import { getCommentsApi } from "./api.js";
import { renderList } from "./renderList.js";
import { renderSigninForm } from "./renderLogin.js";
import { renderNewCommentForm } from "./renderNewComment.js";


const commentsLoading = document.getElementById('start');

let myLocalStorage = window.localStorage;
let token = myLocalStorage.getItem('token');
let comments = [];


const fetchCommentsAndRender = () => {
  getCommentsApi()
    .then((commentsResponse) => {
      comments = commentsResponse;
      commentsLoading.style.display = 'none';
      renderApp();
    });
};

const renderApp = () => {
  // render формы авторизации
  const loginContainerElement = document.getElementById("login-container");
  if (!token) {
    renderSigninForm({
      loginContainerElement,
      fetchCommentsAndRender,

      setToken: function (newToken) {
        token = newToken;
        myLocalStorage.setItem('token', newToken);
      }
    });
  }
  // render списка комментариев
  const commentsElement = document.getElementById("comments-container");
  const appTemplate = `
    <ul id="list" class="comments"></ul>
    <div>
      ${!token ? '' : `<button id="delete-comment" class="add-form-button">Удалить последнее сообщение</button>`}
    </div>`;
  commentsElement.innerHTML = appTemplate;

  renderList({ comments, token, fetchCommentsAndRender });
  if (token) {
    const listElements = document.getElementById('list');
    const deleteElement = document.getElementById('delete-comment');
    deleteElement.addEventListener("click", () => {
      listElements.removeChild(listElements.lastChild);
    });
  }
  // render формы новых комментариев
  if (token) {
    const newCommentContainerElement = document.getElementById("comment-form-container");
    renderNewCommentForm({ newCommentContainerElement, fetchCommentsAndRender });
  }
};
fetchCommentsAndRender();