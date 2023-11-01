"use strict";
import { getCommentsApi, addCommentApi } from "./api.js";
import { renderList } from "./renderList.js";
import { renderSignin } from "./renderLogin.js";

let token = null;

const renderApp = () => {
    const buttonElement = document.getElementById('addMessage');
    const nameElement = document.getElementById('name-input');
    const commentElement = document.getElementById('comment-input');
    const listElements = document.getElementById('list');
    const commentForm = document.getElementById('comment-form');
    const deleteElement = document.getElementById('delete-comment');
    const commentFormAdding = document.getElementById('comment-form-adding');
    const commentsLoading = document.getElementById('start');
    let comments = [];
    const appElement = document.getElementById("app");

    if (!token) {
        renderSignin({ appElement });
        return;

    }

    const appTemplate = `
<div class="container">
    <div id="start">
      Пожалуйста подождите, загружаю комментарии...
    </div>
    <ul id="list" class="comments">
    </ul>
    <div>
      <div>
        <button id="delete-comment" class="add-form-button">Удалить последнее сообщение</button>
      </div>
    </div>
    <div id="comment-form-adding" style="display: none;">
      Комментарий добавляется...
    </div>
    <div id="comment-form" class="add-form">
      <input type="text" id="name-input" class="add-form-name" placeholder="Введите ваше имя" value="" />
      <textarea type="textarea" id="comment-input" class="add-form-text" placeholder="Введите ваш коментарий"
        rows="4"></textarea>
      <div class="add-form-row">
        <button id="addMessage" class="add-form-button">Написать</button>
      </div>
    </div>
  </div>
`;

    const getComments = () => {
        return getCommentsApi({ comments, renderList })
    };
    getComments()
        .then(() => {
            commentsLoading.style.display = 'none';
        });

    renderList({ comments });

    const postMessage = () => {
        buttonElement.classList.remove('error-submit');
        commentForm.style.display = 'none';
        commentFormAdding.style.display = 'flex';
        addCommentApi({ commentElement, nameElement, commentForm, commentFormAdding, getComments });
    };

    const formCallback = (e) => {
        if (e.key !== "Enter" && e.srcElement.id !== "addMessage") {
            return;
        }
        postMessage();
    };

    buttonElement.addEventListener("click", formCallback);
    commentForm.addEventListener("keyup", formCallback);

    deleteElement.addEventListener("click", () => {
        listElements.removeChild(listElements.lastChild);
    });
};
renderApp();