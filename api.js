

export function getCommentsApi({ comments, render }) {
    return fetch(" https://wedev-api.sky.pro/api/v1/denis-vasilev/comments", {
        method: 'GET',
    })
        .then((response, wrongResponse) => {
            return response.json()
        })
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

}


export function addCommentApi({ commentElement, nameElement, commentForm, commentFormAdding, getComments }) {
  fetch(" https://wedev-api.sky.pro/api/v1/denis-vasilev/comments", {
        method: 'POST',
        body: JSON.stringify({
            text: commentElement.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
            name: nameElement.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
            //   forceError: true
        })
    })
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
}