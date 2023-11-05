

export function getCommentsApi() {
    return fetch(" https://wedev-api.sky.pro/api/v2/denis-vasilev/comments", {
        method: 'GET',
    })
        .then((response, wrongResponse) => {
            return response.json()
        })
        .then((responseData) => {
            return responseData.comments.map((el) => {
                return {
                    name: el.author.name,
                    date: new Date(el.date),
                    comment: el.text,
                    likeCount: el.likes,
                    isLike: false,
                    isEdit: false,
                    id: el.id,
                };
            });
        });
}


export function addCommentApi({ commentElement, nameElement, commentForm, commentFormAdding, fetchCommentsAndRender }) {
    fetch(" https://wedev-api.sky.pro/api/v2/denis-vasilev/comments", {
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
            return fetchCommentsAndRender();
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


export function loginUserApi({ login, password }) {
    return fetch("https://wedev-api.sky.pro/api/user/login", {
        method: 'POST',
        body: JSON.stringify({
            login,
            password
        })
    }).then((response) => {
        if (response.status === 400) {
            throw new Error("Неправильный логин или пароль");
        }
        return response.json();
    });
}

export function newUserRegistrationApi({ login, password, name }) {
    return fetch("https://wedev-api.sky.pro/api/user", {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
            name,
        })
    }).then((response) => {
        if (response.status === 400) {
            throw new Error("Такой пользователь уже существует");
        }
        return response.json();
    });
}

export function changeLikeApi({ comment }) {
    return fetch(`https://wedev-api.sky.pro/api/v2/denis-vasilev/comments/${comment.id}/toggle-like`, {
        method: 'POST',
        headers: {
            Authorization: window.localStorage.getItem('token'),
        }
    }).then((response) => {
        return response.json();
    });
}