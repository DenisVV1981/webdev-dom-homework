export function getCommentsApi() {
    return fetch(" https://wedev-api.sky.pro/api/v1/denis-vasilev/comments", {
        method: 'GET',
    })
        .then((response, wrongResponse) => {
            return response.json()
        })
}


export function addCommentApi({ commentElement, nameElement }) {
    return fetch(" https://wedev-api.sky.pro/api/v1/denis-vasilev/comments", {
        method: 'POST',
        body: JSON.stringify({
            text: commentElement.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
            name: nameElement.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
            //   forceError: true
        })
    })
}