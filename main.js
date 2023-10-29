"use strict";
import { getCommentsApi, addCommentApi } from "./api.js";
import { render } from "./render.js";

const comment = {
    text: "Это комментарий к цитате."
};

const QUOTE_BEGIN = "QUOTE_BEGIN";
const QUOTE_END = "QUOTE_END";

// Создаем строку с использованием шаблонных строк
const formattedComment = `${QUOTE_BEGIN} ${comment.text} ${QUOTE_END}`;

console.log(formattedComment);
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
    return getCommentsApi()
        .then((responseData) => {
            comments = responseData.comments.map((el) => {
                return {
                    name: el.author.name,
                    date: new Date(el.date),
                    comment: el.text,
                    likeCount: el.likes,
                    isLike: false,
                    isEdit: false
                };
            });
            render({ comments });
        });
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

    addCommentApi({ commentElement, nameElement })
        .then((response) => {
            console.log(response);
            if (response.status === 201) {
                return response.json();
            } else if (response.status === 400) {
                response.json().then((responseData) => {
                    alert(responseData.error);
                });
                throw new Error("400 Ошибка");
            } else if (response.status === 500) {
                postMessage();
                throw new Error('500 Ошибка');
            }
        })
        .then((responseData) => {
            return getComments();
        })
        .then(() => {
            nameElement.value = "";
            commentElement.value = "";
        })
        .catch((error) => {
            console.log(error);
            if (error.message === '400 Ошибка') {
                alert("Поля ввода должны содержать не менее 3 символов");
            } else if (error.message === '500 Ошибка') {
            } else { alert("Кажется, у вас пропал интернет. Проверьте соединение."); }
        })
        .finally(() => {
            commentForm.style.display = 'flex';
            commentFormAdding.style.display = 'none';
        });
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

console.log("It works!");