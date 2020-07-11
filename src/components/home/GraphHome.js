import React, { useEffect, useState } from 'react'
import Card from '../card/Card'
import styles from './home.module.css'
import { gql } from 'apollo-boost'
import { useQuery } from 'react-apollo'

export default function GraphHome() {
    let [chars, setChars] = useState([])
    let query = gql`{
        characters {
            results {
              name
              image
            }
          }
    }`
    let { data, loading, error } = useQuery(query)

    useEffect(() => {
        if (data && !loading && !error) {
            setChars([...data.characters.results])
        }
    }, [data])

    function nextCharacter(){
        chars.shift()
        setChars([...chars])
    }

    if (loading) {
        return <h2>Cargando...</h2>
    }
    console.log(data)
    return <Card {...chars[0]} leftClick={nextCharacter} />
}