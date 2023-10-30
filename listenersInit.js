export {initChangeLike, initEditElements, initSaveButtons, initCommentClickListener }

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

const initChangeLike = ({ comments, render }) => {
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
const initEditElements = ({ comments, render }) => {
    const editButtonElements = document.querySelectorAll('.edit-form-button');
    for (const editButton of editButtonElements) {
        editButton.addEventListener('click', () => {
            const index = editButton.dataset.index;
            comments[index].isEdit = true;
            render({ comments });
        });
    }
};
const initSaveButtons = ({ comments, render }) => {
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

const initCommentClickListener = ({ comments, render }) => {
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
