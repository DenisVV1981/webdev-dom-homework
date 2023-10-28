"use strict";
import { getCommentsApi, addCommentApi } from "./api.js";

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

  /*делаем API запрос*/
  const getComments = () => {
     return getCommentsApi().then((responseData) => {
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
        render();
      });
  };
  getComments()
    .then(() => {
      commentsLoading.style.display = 'none';
    });

  // Функция для имитации обащения к API, и задержки получения ответа. 
  // Т.е. ответ приходит не мгновенно, т.е. пока ждем ответ надо показать анимацию.
  // Не смотрите особо на внутренности, мы разберемся с этим позже
  function delay(interval = 300) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, interval);
    });
  };

  // Пример использования:

  const initChangeLike = () => {
    const changeLikes = document.querySelectorAll(".like-button");
    for (const changeLike of changeLikes) {
      changeLike.addEventListener('click', (event) => {
        event.stopPropagation();
        const index = changeLike.dataset.index;
        let comment = comments[index];

        comment.isLikeLoading = true;
        render();

        delay(2000).then(() => {
          comment.likeCount = comment.isLike
            ? comment.likeCount - 1
            : comment.likeCount + 1;
          comment.isLike = !comment.isLike;
          comment.isLikeLoading = false;
          render();
        });
      });
    };
  };
  const initEditElements = () => {
    const editButtonElements = document.querySelectorAll('.edit-form-button');
    for (const editButton of editButtonElements) {
      editButton.addEventListener('click', () => {
        const index = editButton.dataset.index;
        comments[index].isEdit = true;
        render();
      });
    }
  };
  const initSaveButtons = () => {
    const saveButtons = document.querySelectorAll(".save-form-button");
    for (const saveButton of saveButtons) {
      saveButton.addEventListener('click', () => {
        const index = saveButton.dataset.index;
        comments[index].isEdit = false;
        comments[index].comment = listElements.querySelectorAll('.comment')[index].querySelector('textarea').value;
        render();
      });
    }
  };

  const initCommentClickListener = () => {
    const clickElemets = document.querySelectorAll('.comment-text');
    for (const clicks of clickElemets) {
      clicks.addEventListener('click', () => {
        const index = clicks.dataset.index;
        commentElement.value = `QUOTE_BEGIN` + comments[index].name + '\n' + `>` + comments[index].comment + 'QUOTE_END\n';
        commentElement.focus();
        render();
      });
    }
  };


  const render = () => {
    listElements.innerHTML = comments.map((comment, index) => {
      let d = comment.date;
      let currentTime = `${d.getDate().toString().padStart(2, 0)}.${(d.getMonth() + 1).toString().padStart(2, 0)}.${d.getFullYear().toString().substr(-2)} ${d.getHours()}:${d.getMinutes()}`;

      return `<li class="comment">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${currentTime}</div>
        </div>
        <div class="comment-body">
          ${comment.isEdit
          ? `<textarea type="textarea"  class="add-form-text" placeholder="Введите ваш коментарий" rows="4">${comment.comment}</textarea>`
          : `<div class="comment-text" data-index="${index}"> ${comment.comment.replaceAll("QUOTE_BEGIN", "<div class='quote'>").replaceAll("QUOTE_END", "</div>")} </div>`}
        </div>
        <div class="comment-footer">
          ${comment.isEdit
          ? `<button  class="save-form-button" data-index="${index}">Сохранить</button>`
          : `<button  class="edit-form-button" data-index="${index}">Редактировать</button>`
        }
          <div class="likes">
            <span class="likes-counter">${comment.likeCount}</span>
            <button class="like-button ${comment.isLike ? '-active-like' : ''} ${comment.isLikeLoading ? '-loading-like' : ''}" data-index="${index}"></button>
          </div>
        </div>
      </li>`;
    }).join('');

    initChangeLike();
    initEditElements();
    initSaveButtons();
    initCommentClickListener();

  };
  render();



  const postMessage = () => {
    buttonElement.classList.remove('error-submit');
    commentForm.style.display = 'none';
    commentFormAdding.style.display = 'flex';

    
    addCommentApi({ commentElement, nameElement }).then((response) => {
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
          // alert ("Сервер сломался, попробуй позже.");
        } else {
          alert("Кажется, у вас пропал интернет. Проверьте соединение.");
        }
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