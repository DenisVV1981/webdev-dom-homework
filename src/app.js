"use strict";
import { getCommentsApi, deleteCommentApi } from "./api.js";
import { renderList } from "./renderList.js";
import { renderSigninForm } from "./renderLogin.js";
import { renderNewCommentForm } from "./renderNewComment.js";
import { renderLogout } from "./renderLogout.js";

const commentsLoading = document.getElementById("start");

let myLocalStorage = window.localStorage;
let token = myLocalStorage.getItem("token");
let comments = [];

export const fetchCommentsAndRender = () => {
    getCommentsApi().then((commentsResponse) => {
        comments = commentsResponse;
        commentsLoading.style.display = "none";
        renderApp();
    });
};

const renderApp = () => {
    // render формы авторизации
    const loginContainerElement = document.getElementById("login-container");
    const logoutContainerElement = document.getElementById("logout-container");
    if (!token) {
        // мы неавторизованы
        renderSigninForm({
            loginContainerElement,

            fetchCommentsAndRender,
            setTokenAndName: function (newToken, userName) {
                token = newToken;
                myLocalStorage.setItem("token", newToken);
                myLocalStorage.setItem("userName", userName);
            },
        });
    } else {
        // мы авторизованы
        const logoutCallback = () => {
            token = null;
            myLocalStorage.removeItem("token");
            myLocalStorage.removeItem("userName");

            fetchCommentsAndRender();
        };
        renderLogout({
            logoutContainerElement,
            callback: logoutCallback,
        });
    }
    // render списка комментариев
    const commentsElement = document.getElementById("comments-container");
    const appTemplate = `
    <ul id="list" class="comments"></ul>
    <div>
      ${
          !token
              ? ""
              : `<button id="delete-comment" class="add-form-button">Удалить последнее сообщение</button>`
      }
    </div>`;
    commentsElement.innerHTML = appTemplate;

    renderList({ comments, token, fetchCommentsAndRender });
    if (token) {
        const listElements = document.getElementById("list");
        const deleteElement = document.getElementById("delete-comment");
        deleteElement.addEventListener("click", () => {
            listElements.removeChild(listElements.lastChild);

            const lastComment = comments[comments.length - 1];
            deleteCommentApi(lastComment.id).then(() => {
                fetchCommentsAndRender();
            });
        });
    }
    // render формы новых комментариев
    const newCommentContainerElement = document.getElementById(
        "comment-form-container",
    );
    if (token) {
        renderNewCommentForm({
            newCommentContainerElement,
            fetchCommentsAndRender,
        });
    } else {
        newCommentContainerElement.innerHTML = null;
    }
};
