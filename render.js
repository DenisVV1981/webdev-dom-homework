
export { render };

const listElements = document.getElementById('list');
const commentElement = document.getElementById('comment-input');

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

const initChangeLike = ({ comments }) => {
    const changeLikes = document.querySelectorAll(".like-button");
    for (const changeLike of changeLikes) {
        changeLike.addEventListener('click', (event) => {
            event.stopPropagation();
            const index = changeLike.dataset.index;
            let comment = comments[index];

            comment.isLikeLoading = true;
            render({ comments });

            delay(2000).then(() => {
                comment.likeCount = comment.isLike
                    ? comment.likeCount - 1
                    : comment.likeCount + 1;
                comment.isLike = !comment.isLike;
                comment.isLikeLoading = false;
                render({ comments });
            });
        });
    };
};
const initEditElements = ({ comments }) => {
    const editButtonElements = document.querySelectorAll('.edit-form-button');
    for (const editButton of editButtonElements) {
        editButton.addEventListener('click', () => {
            const index = editButton.dataset.index;
            comments[index].isEdit = true;
            render({ comments });
        });
    }
};
const initSaveButtons = ({ comments }) => {
    const saveButtons = document.querySelectorAll(".save-form-button");
    for (const saveButton of saveButtons) {
        saveButton.addEventListener('click', () => {
            const index = saveButton.dataset.index;
            comments[index].isEdit = false;
            comments[index].comment = listElements.querySelectorAll('.comment')[index].querySelector('textarea').value;
            render({ comments });
        });
    }
};

const initCommentClickListener = ({ comments }) => {
    const clickElemets = document.querySelectorAll('.comment-text');
    for (const clicks of clickElemets) {
        clicks.addEventListener('click', () => {
            const index = clicks.dataset.index;
            commentElement.value = `QUOTE_BEGIN` + comments[index].name + '\n' + `>` + comments[index].comment + 'QUOTE_END\n';
            commentElement.focus();
        render({ comments });
        });
    }
};


const render = ({ comments }) => {
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

    initChangeLike({ comments });
    initEditElements({ comments });
    initSaveButtons({ comments });
    initCommentClickListener({ comments });

};