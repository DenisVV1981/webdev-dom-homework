
export { renderList };
import { initChangeLike, initEditElements, initSaveButtons, initAnswerCommentListener } from "./listenersInit.js";



const renderList = ({ comments, token, fetchCommentsAndRender }) => {

  const render = () => {
    const listElements = document.getElementById('list');
    listElements.innerHTML = comments.map((comment, index) => {
      let d = comment.date;
      let currentTime = `${d.getDate().toString().padStart(2, 0)}.${(d.getMonth() + 1).toString().padStart(2, 0)}.${d.getFullYear().toString().substr(-2)} ${d.getHours()}:${d.getMinutes()}`;

      return `<li class="comment">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${currentTime}</div>
        </div>
        <div class="comment-body">
        ${token ?
          `${comment.isEdit
            ? `<textarea type="textarea"  class="add-form-text" rows="4">${comment.comment}</textarea>`
            : `<div class="comment-text" data-index="${index}"> ${comment.comment.replaceAll("QUOTE_BEGIN", "<div class='quote'>").replaceAll("QUOTE_END", "</div>")} </div>`}`
          :
          `<div class="comment-text" data-index="${index}">${comment.comment.replaceAll("QUOTE_BEGIN", "<div class='quote'>").replaceAll("QUOTE_END", "</div>")}</div>`
        }
        </div>
        <div class="comment-footer">
        ${token ?
          `${comment.isEdit
            ? `<button  class="save-form-button" data-index="${index}">Сохранить</button>`
            : `<button  class="edit-form-button" data-index="${index}">Редактировать</button>`
          }`
          :
          ""
        } 
          <div class="likes">
            <span class="likes-counter">${comment.likeCount}</span>
            <button class="like-button ${comment.isLike ? '-active-like' : ''} ${comment.isLikeLoading ? '-loading-like' : ''}" data-index="${index}"></button>
          </div>
        </div>
      </li>`;
    }).join('');

    initChangeLike({ comments, fetchCommentsAndRender });
    initEditElements({ comments, render });
    initSaveButtons({ comments, render, fetchCommentsAndRender });
    initAnswerCommentListener({ comments });

  };
  render();
};