import axios from 'axios'
import { updateDb, getFavs } from '../firebase'
import ApolloClient,{gql} from 'apollo-boost'
//constantes
let initialData = {
    fetching: false,
    array: [],
    current: {},
    favorites: []
}
let url = "https://rickandmortyapi.com/api/character"
let client = new ApolloClient({
    uri:"https://rickandmortyapi.com/graphql"
})

let GET_CHARACTERS = "GET_CHARACTERS"
let GET_CHARACTERS_SUCCESS = "GET_CHARACTERS_SUCCESS"
let GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR"


let REMOVE_CHARACTER = "REMOVE_CHARACTER"
let ADD_TO_FAVORITES = "ADD_TO_FAVORITES"

let GET_FAVS = "GET_FAVS"
let GET_FAVS_SUCCESS = "GET_FAVS_SUCCESS"
let GET_FAVS_ERROR = "GET_FAVS_ERROR"

//reducers
export default function reducer(state = initialData, action) {
    switch (action.type) {
        case GET_FAVS:
            return { ...state, fetching: true }
        case GET_FAVS_SUCCESS:
            return { ...state, fetching: false, favorites: action.payload }
        case GET_FAVS_ERROR:
            return { ...state, fetching: false, error: action.payload }
        case GET_CHARACTERS:
            return { ...state, fetching: true }
        case GET_CHARACTERS_ERROR:
            return { ...state, fetching: false, error: action.payload }
        case GET_CHARACTERS_SUCCESS:
            return { ...state, array: action.payload, fetching: false }
        case REMOVE_CHARACTER:
            return { ...state, array: action.payload }
        case ADD_TO_FAVORITES:
            return { ...state, ...action.payload }
        default:
            return state
    }
}
//actions
function saveStorageFavorites(storage){
    localStorage.favorites = JSON.stringify(storage)
}
export let restoreFavoritesAction = () =>(dispatch,getState) =>{
    let favorites = localStorage.getItem('favorites')
    favorites = JSON.parse(favorites)
    if(favorites){
        dispatch({
            type:GET_FAVS_SUCCESS,
            payload:favorites,
        })
    }
}
export let retrieveFavs = () => (dispatch, getState) => {

    dispatch({
        type: GET_FAVS
    })
    let { uid } = getState().user
    return getFavs(uid)
        .then(array => {
            dispatch({
                type: GET_FAVS_SUCCESS,
                payload: [...array]
            })
            saveStorageFavorites(array)
        })
        .catch(err => {
            console.log(err)
            dispatch({
                type: GET_FAVS_ERROR,
                payload: err.message
            })
        })

}

export let getCharactersAction = () => (dispatch, getState) => {
    dispatch({
        type: GET_CHARACTERS,
    })
    let query = gql`
    {
        characters {
            results {
              name
              image
            }
        }
    }
    `

    return client.query({
        query
    })
    .then(({data,error})=>{
        if(error){
            dispatch({
                type:GET_CHARACTERS_ERROR,
                payload:error,
            })
            return
        }
        dispatch({
            type:GET_CHARACTERS_SUCCESS,
            payload:data.characters.result
        })
    })

    // dispatch({
    //     type: GET_CHARACTERS,
    // })
    // return axios.get(url)
    //     .then(res => {
    //         dispatch({
    //             type: GET_CHARACTERS_SUCCESS,
    //             payload: res.data.results,
    //         })
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         dispatch({
    //             type: GET_CHARACTERS_ERROR,
    //             payload: err.response.message
    //         })
    //     })
}

export let removeCharacterAction = () => (dispatch, getState) => {
    //Donde estan los personajes
    let { array } = getState().characters
    array.shift()
    dispatch({
        type: REMOVE_CHARACTER,
        payload: [...array]
    })
}

export let addToFavoritesAction = () => (dispatch, getState) => {
    let { array, favorites } = getState().characters
    let { uid } = getState().user
    let char = array.shift()
    favorites.push(char)
    updateDb(favorites, uid)
    dispatch({
        type: ADD_TO_FAVORITES,
        payload: { array: [...array], favorites: [...favorites] }
    })
}