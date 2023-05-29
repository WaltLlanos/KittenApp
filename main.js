const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1/',
  });
  api.defaults.headers.common['X-API-KEY'] = 'live_zCM3RCpNiuQmK2XqzqCTE2GNjoQZyPFBewwHSOEEizeafMg0HmkAZxF43496Czu5';

const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';
const API_URL_DELETE = (id) =>  `https://api.thecatapi.com/v1/favourites/${id}`;
const img1 = document.querySelector('#img1');
const img2 = document.querySelector('#img2');
const btn1 = document.querySelector('#btn1');
const btn2 = document.querySelector('#btn2');
const spanError = document.querySelector('#error')

async function loadRandom(){
    const res = await fetch(API_URL_RANDOM, {
        headers: {
            'X-API-KEY': 'live_zCM3RCpNiuQmK2XqzqCTE2GNjoQZyPFBewwHSOEEizeafMg0HmkAZxF43496Czu5'
        }
    });
    const data = await res.json();
    console.log('Random')
    console.log(data)

    if (res.status !==200) {
        spanError.innerHTML = "Hubo un error: " + res.status;
    } else {
        img1.src = data[0].url;
        img2.src = data[1].url;

        btn1.onclick = () => saveFavorite(data[0].id);
        btn2.onclick = () => saveFavorite(data[1].id);
    }
};

async function loadFavorites(){
    const res = await fetch(API_URL_FAVORITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': 'live_zCM3RCpNiuQmK2XqzqCTE2GNjoQZyPFBewwHSOEEizeafMg0HmkAZxF43496Czu5'
        }
    });
    console.log('Favorites')
    console.log(res)

    if (res.status !==200) {
        spanError.innerHTML = "Hubo un error: " + res.status;
    } else {
        const section = document.getElementById('favoriteCats')
        section.innerHTML = ""
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Favorite Kittens');
        section.appendChild(h2)
        h2.appendChild(h2Text)

        const data = await res.json();
        console.log(data);
        data.forEach(cat => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Remove');

            btn.appendChild(btnText)
            img.src = cat.image.url
            img.width = 500
            article.appendChild(img)
            article.appendChild(btn)
            section.appendChild(article)
            btn.onclick = () => deleteFavorite(cat.id)
        })
    }
};

async function saveFavorite(id){
    const {data, status} = await api.post('/favourites', {
        image_id: id,
    });

// CODE WITHOUT AXIOS:
// const res = await fetch(API_URL_FAVORITES, {
//     method: "POST",
//     headers: {
//         'Content-Type': 'application/json',
//         'X-API-KEY': 'live_zCM3RCpNiuQmK2XqzqCTE2GNjoQZyPFBewwHSOEEizeafMg0HmkAZxF43496Czu5'
//     },
//     body: JSON.stringify({
//             image_id: id,
//         }),
//     });
// console.log('Save')
// console.log(res)

    if (status !==200) {
        spanError.innerHTML = "Hubo un error: " + status;
    } else {
        console.log('Cat Saved')
        loadFavorites()
        loadRandom()
    }


    };
    
async function deleteFavorite(id){
    const res = await fetch(API_URL_DELETE(id), {
        method: "DELETE",
        headers: {
            'X-API-KEY': 'live_zCM3RCpNiuQmK2XqzqCTE2GNjoQZyPFBewwHSOEEizeafMg0HmkAZxF43496Czu5'
        }
        });
    console.log('Delete')
    console.log(res)

    if (res.status !==200) {
        spanError.innerHTML = "Hubo un error: " + res.status;
    } else {
        const data = await res.json();
        console.log(res);
        console.log('Cat Deleted')
        loadFavorites()
    }

};

async function uploadCatPic(){
    const form = document.getElementById('uploadForm')
    const formData = new FormData(form);

    console.log(formData.get('file'))

    const res = await fetch(API_URL_UPLOAD, {
        method: "POST",
        headers: {
            'X-API-KEY': 'live_zCM3RCpNiuQmK2XqzqCTE2GNjoQZyPFBewwHSOEEizeafMg0HmkAZxF43496Czu5'
        },
        body: formData,
        });
    console.log('Upload')
    console.log(res)

    if (res.status !==201) {
        spanError.innerHTML = `Hubo un error: ${res.status} ${data.message}`;
    } else {
        const data = await res.json();
        console.log(res);
        console.log('Cat Uploaded')
        console.log({ data });
        console.log(data.url);
        saveFavorite(data.id)
    }

};

loadRandom(); 
loadFavorites(); 