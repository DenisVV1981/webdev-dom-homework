import { addCommentApi } from "./api.js";


export function renderNewCommentForm({ newCommentContainerElement, fetchCommentsAndRender }) {

    const template = ` 
     <div id="comment-form-adding" style="display: none;">
         Комментарий добавляется...
     </div>
    <div id="comment-form" class="add-form">
      <input type="text" id="name-input" disabled class="add-form-name" placeholder="Введите ваше имя" value="${window.localStorage.getItem('userName')}" />
      <textarea type="textarea" id="comment-input" class="add-form-text" placeholder="Введите ваш коментарий"
      rows="4"></textarea>
      <div class="add-form-row">
        <button id="addMessage" class="add-form-button">Написать</button>
      </div>
    </div>`;

    newCommentContainerElement.innerHTML = template;

    const commentFormAdding = document.getElementById('comment-form-adding');
    const nameElement = document.getElementById('name-input');
    const commentElement = document.getElementById('comment-input');
    const commentForm = document.getElementById('comment-form');
    const buttonElement = document.getElementById('addMessage');



    const postMessage = () => {
        buttonElement.classList.remove('error-submit');
        commentForm.style.display = 'none';
        commentFormAdding.style.display = 'flex';
        addCommentApi({ commentElement, nameElement, commentForm, commentFormAdding, fetchCommentsAndRender });
    };

    const formCallback = (e) => {
        if (e.key !== "Enter" && e.srcElement.id !== "addMessage") {
            return;
        }
        postMessage();
    };

    buttonElement.addEventListener("click", formCallback);
    commentForm.addEventListener("keyup", formCallback);

};