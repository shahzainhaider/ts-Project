console.log('connected to server nowwww')
let getUserName = document.querySelector('input') as HTMLInputElement;
let form = document.querySelector('form') as HTMLFormElement;
let btn = document.getElementById('btn') as HTMLButtonElement;
let cardContainer = document.querySelector('.card_container') as HTMLElement;

interface UserData {
    login: string;
    avatar_url: string;
    url: string;
    id: string
}

async function customFetcher<T>(url: string, option?: RequestInit): Promise<T> {
    let res = await fetch(url)
    let data = await res.json()
    return data
}

function showResultUI(singleUser: UserData) {
    const { login, id, avatar_url, url } = singleUser
    cardContainer.insertAdjacentHTML(
        'beforeend',
        `<div class='card'>
            <img src=${avatar_url} alt=${login}>
            <div class='UserDetail'>
                <h4>${login}</h4>
                <a href=${url}>github</a>
            </div>
        </div>`
    )
}

function fetchUserData(url: string) {
    customFetcher<UserData[]>(url, {}).then((userInfo) => {
        for (let singleUser of userInfo) {
            showResultUI(singleUser)
        }
    })
}

fetchUserData('https://api.github.com/users')

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        let searchUser = getUserName.value.toLowerCase();
        let url = 'https://api.github.com/users'
        let allUser = await customFetcher<UserData[]>(url, {})
        let matchingUser = allUser.filter((user) => {
            return user.login.toLowerCase().includes(searchUser)
        })
        cardContainer.innerHTML = ''
        if (matchingUser.length === 0) {
            cardContainer?.insertAdjacentHTML(
                "beforeend",
                `<p class="empty-msg">No matching users found.</p>`
            );
            getUserName.value=''
        } else {
            for (const singleUser of matchingUser) {
                showResultUI(singleUser);
            }
        }
        
    } catch (error) {
        console.log(error)
    }

})