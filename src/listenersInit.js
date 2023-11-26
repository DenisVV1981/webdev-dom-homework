import { changeLikeApi } from "./api.js";

export {
    initChangeLike,
    initEditElements,
    initSaveButtons,
    initAnswerCommentListener,
};

const initChangeLike = ({ comments, fetchCommentsAndRender }) => {
    const changeLikes = document.querySelectorAll(".like-button");
    for (const changeLike of changeLikes) {
        changeLike.addEventListener("click", (event) => {
            event.stopPropagation();

            const index = changeLike.dataset.index;
            let comment = comments[index];

            changeLikeApi({ comment }).then(() => {
                fetchCommentsAndRender();
            });
        });
    }
};
const initEditElements = ({ comments, render }) => {
    const editButtonElements = document.querySelectorAll(".edit-form-button");
    for (const editButton of editButtonElements) {
        editButton.addEventListener("click", () => {
            const index = editButton.dataset.index;
            comments[index].isEdit = true;
            render();
        });
    }
};
const initSaveButtons = ({ comments, render }) => {
    const listElements = document.getElementById("list");
    const saveButtons = document.querySelectorAll(".save-form-button");
    for (const saveButton of saveButtons) {
        saveButton.addEventListener("click", () => {
            const index = saveButton.dataset.index;
            comments[index].isEdit = false;
            comments[index].comment = listElements
                .querySelectorAll(".comment")
                [index].querySelector("textarea").value;
            render();
        });
    }
};

const initAnswerCommentListener = ({ comments }) => {
    const clickElemets = document.querySelectorAll(".comment-text");
    for (const clicks of clickElemets) {
        clicks.addEventListener("click", () => {
            const commentElement = document.getElementById("comment-input");
            const index = clicks.dataset.index;
            commentElement.value =
                `QUOTE_BEGIN` +
                comments[index].name +
                "\n" +
                `>` +
                comments[index].comment +
                "QUOTE_END\n";
            commentElement.focus();
        });
    }
};
