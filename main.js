"use strict";
import { getCommentsApi, addCommentApi } from "./api.js";
import { render } from "./render.js";

const buttonElement = document.getElementById('addMessage');
const nameElement = document.getElementById('name-input');
const commentElement = document.getElementById('comment-input');
const listElements = document.getElementById('list');
const commentForm = document.getElementById('comment-form');
const deleteElement = document.getElementById('delete-comment');
const commentFormAdding = document.getElementById('comment-form-adding');
const commentsLoading = document.getElementById('start');
let comments = [];

const getComments = () => {
    return getCommentsApi({ comments, render })
};
getComments()
    .then(() => {
        commentsLoading.style.display = 'none';
    });

render({ comments });

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
})
