

const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

// const genres = [
//     {
//       "id": 28,
//       "name": "Action"
//     },
//     {
//       "id": 12,
//       "name": "Adventure"
//     },
//     {
//       "id": 16,
//       "name": "Animation"
//     },
//     {
//       "id": 35,
//       "name": "Comedy"
//     },
//     {
//       "id": 80,
//       "name": "Crime"
//     },
//     {
//       "id": 99,
//       "name": "Documentary"
//     },
//     {
//       "id": 18,
//       "name": "Drama"
//     },
//     {
//       "id": 10751,
//       "name": "Family"
//     },
//     {
//       "id": 14,
//       "name": "Fantasy"
//     },
//     {
//       "id": 36,
//       "name": "History"
//     },
//     {
//       "id": 27,
//       "name": "Horror"
//     },
//     {
//       "id": 10402,
//       "name": "Music"
//     },
//     {
//       "id": 9648,
//       "name": "Mystery"
//     },
//     {
//       "id": 10749,
//       "name": "Romance"
//     },
//     {
//       "id": 878,
//       "name": "Science Fiction"
//     },
//     {
//       "id": 10770,
//       "name": "TV Movie"
//     },
//     {
//       "id": 53,
//       "name": "Thriller"
//     },
//     {
//       "id": 10752,
//       "name": "War"
//     },
//     {
//       "id": 37,
//       "name": "Western"
//     }
//   ]

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

// const tagsEl = document.getElementById('tags');

// const prev = document.getElementById('prev')
// const next = document.getElementById('next')
// const current = document.getElementById('current')


// var currentPage = 1;
// var nextPage = 2;
// var prevPage = 3;
// var lastUrl = '';
// var totalPages = 100;

// var selectedGenre = []
// // setGenre();
// function setGenre() {
//     tagsEl.innerHTML= '';
//     genres.forEach(genre => {
//         const t = document.createElement('div');
//         t.classList.add('tag');
//         t.id=genre.id;
//         t.innerText = genre.name;
//         t.addEventListener('click', () => {
//             if(selectedGenre.length == 0){
//                 selectedGenre.push(genre.id);
//             }else{
//                 if(selectedGenre.includes(genre.id)){
//                     selectedGenre.forEach((id, idx) => {
//                         if(id == genre.id){
//                             selectedGenre.splice(idx, 1);
//                         }
//                     })
//                 }else{
//                     selectedGenre.push(genre.id);
//                 }
//             }
//             console.log(selectedGenre)
//             getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')))
//             highlightSelection()
//         })
//         tagsEl.append(t);
//     })
// }

// function highlightSelection() {
//     const tags = document.querySelectorAll('.tag');
//     tags.forEach(tag => {
//         tag.classList.remove('highlight')
//     })
//     clearBtn()
//     if(selectedGenre.length !=0){   
//         selectedGenre.forEach(id => {
//             const hightlightedTag = document.getElementById(id);
//             hightlightedTag.classList.add('highlight');
//         })
//     }

// }

// function clearBtn(){
//     let clearBtn = document.getElementById('clear');
//     if(clearBtn){
//         clearBtn.classList.add('highlight')
//     }else{

//         let clear = document.createElement('div');
//         clear.classList.add('tag','highlight');
//         clear.id = 'clear';
//         clear.innerText = 'Clear x';
//         clear.addEventListener('click', () => {
//             selectedGenre = [];
//             setGenre();            
//             getMovies(API_URL);
//         })
//         tagsEl.append(clear);
//     }

// }

// var seid ='{{usr_input}}';
var seid = "Iron Man & Captain America: Heroes United";
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;

    // selectedGenre=[];
    // setGenre();
    if (searchTerm) {
        getMovies(searchURL + '&query=' + searchTerm);
    } else {
        getMovies(API_URL);
    }

})


getMovies(API_URL);
function getMovies(url) {
    const link = 'https://api.themoviedb.org/3/search/movie?api_key=1cf50e6248dc270629e802686245c2c8&query=iron%20man';
    lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)

        if (data.results.length !== 0) {
            showMovies(data.results);

        } else {
            main.innerHTML = `<h1 class="no-results">No Results Found</h1>`
        }

    })

}


function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {

        const { title, poster_path, vote_average, overview, id, release_date } = movie;
        const movieEl = document.createElement('div');

        movieEl.classList.add('movie');



        movieEl.innerHTML = `
  

  <div class="row" style="">
    <div class="col-lg-4">
           <img src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title}"  >
    
    </div>
    <div class="col-lg-8">
           <div class="movie-info" >
                  <p style="font-size:50px;margin-top:0px">${title}</p>

                 <button class="know-more" >${vote_average}    <i class="fa fa-star" aria-hidden="true" style="color:white;font-size:15px;"></i></button>
                  <p style="font-size:40px;">Release Year : ${release_date[0]}${release_date[1]}${release_date[2]}${release_date[3]}</p>
                  <p style="font-size:40px;"> Budget :</p>
                  <p style="font-size:40px;"> Revenew : <span class='${getrevenue(8, 8)}'>${vote_average} </span></p>
               </div>  
                <button class="know-more" id="${id}">Play Trailer</button>
                 
            </div>
  </div>
 <div class="row" >
    
               
                  

                      <h1>Overview</h1>
                      ${overview}
                      
           
  </div>
            
      
            
        `

        main.appendChild(movieEl);



        // document.getElementById(id).addEventListener('click', () => {
        //   console.log(id)
        //   openNav(movie)
        // })

    })
}




