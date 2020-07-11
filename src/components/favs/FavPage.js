import React from 'react'
import { connect } from 'react-redux'
import styles from './favs.module.css'
import Card from '../card/Card'

 function FavPage({ characters }) {
    function renderCharacter(char, i) {
        return (
            <Card {...char} key={i} />
        )
    }
    return (
        <div className={styles.container}>
            <h2>Favoritos</h2>
            {characters.map(renderCharacter)}
            {!characters.length && <h3>No hay personajes agregados</h3>}
        </div>
    )
}

function mapStateToProps(state) {
    return {
        characters: state.characters.favorites
    }
}

export default connect(mapStateToProps)(FavPage)