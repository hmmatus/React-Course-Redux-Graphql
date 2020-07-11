import { loginWithGoogle,logoutWithGoogle } from '../firebase'
import {retrieveFavs} from './charsDuck'
//Constantes
let initialData = {
    loggedIn: false,
    fetching: false
}
let LOGIN = "LOGIN"
let LOGIN_SUCCESS = "LOGIN_SUCCESS"
let LOGIN_ERROR = "LOGIN_ERROR"

let LOG_OUT="LOG_OUT"

//reducer
export default function reducer(state = initialData, action) {
    switch (action.type) {
        case LOGIN_ERROR:
            return { ...state, fetching: false, error: action.payload }
        case LOGIN_SUCCESS:
            return { ...state, fetching: false, loggedIn: true, ...action.payload }
        case LOGIN:
            return { ...state, fetching: true }
        case LOG_OUT:
            return {...initialData}

        default:
            return state;

    }

}

//auxiliar
function saveStorage(storage) {
    //localStorage.storage = JSON.stringify(storage)
    localStorage.storage=JSON.stringify(storage)
}
//action (action creator)
export let restoreSessionAction = () =>dispatch=>{
    let storage = localStorage.getItem('storage')
    storage = JSON.parse(storage)
    if(storage && storage.user){
        dispatch({
            type:LOGIN_SUCCESS,
            payload:storage.user,
        })
    }
}
export let doGoogleLoginAction = () => (dispatch, getState) => {
    dispatch({
        type: LOGIN
    })
    return loginWithGoogle()
        .then(user => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: { 
                    uid:user.uid,
                    displayName:user.displayName,
                    email:user.email,
                    photoUrl:user.photoURL
                 }
            })
            saveStorage(getState())
            retrieveFavs()(dispatch,getState)
        })
        .catch(err => {
            console.log(err)
            dispatch({
                type: LOGIN_ERROR,
                payload: err.message
            })
        })
}

export let doGoogleLogout = () => (dispatch,getState) =>{
    logoutWithGoogle()
    dispatch({
        type:LOG_OUT,
    })
    localStorage.removeItem('storage')
    
}