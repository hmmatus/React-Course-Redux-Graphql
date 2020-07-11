import React from 'react'
import styles from './login.module.css'
import { connect } from 'react-redux'
import { doGoogleLoginAction,doGoogleLogout } from '../../redux/userDuck'

function LoginPage({ fetching, loggedIn, doGoogleLoginAction,doGoogleLogout }) {
    function doLogin() {
        doGoogleLoginAction()
    }
    function doLogout(){
        doGoogleLogout()
    }
    if (fetching) return <h2>...cargando</h2>
    return (
        <div className={styles.container}>
            {loggedIn ? <h1>
                Cierra tu sesión
            </h1> :
                <h1>
                    Inicia Sesión con Google
        </h1>}
            {loggedIn ? <button onClick={doLogout}>
                Cerrar Sesión
            </button> :
                <button onClick={doLogin}>
                    Iniciar
        </button>}
        </div>
    )
}
//Solo necesito fetching
export function mapState(state) {
    return {
        fetching: state.user.fetching,
        loggedIn: state.user.loggedIn
    }
}
export default connect(mapState, { doGoogleLoginAction,doGoogleLogout })(LoginPage)