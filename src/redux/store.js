import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import userReducer, { restoreSessionAction } from './userDuck'
import charReducer,{getCharactersAction,restoreFavoritesAction} from './charsDuck'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let rootReducer = combineReducers({
    user: userReducer,
    characters:charReducer,
})

export default function generateStore() {
    let store = createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(thunk))
    )

    getCharactersAction()(store.dispatch,store.getState)
    restoreSessionAction()(store.dispatch)
    restoreFavoritesAction()(store.dispatch)
    return store

}
