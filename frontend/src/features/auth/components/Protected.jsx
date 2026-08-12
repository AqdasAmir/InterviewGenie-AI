import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'
import Loader from '../../components/Loader'

const Protected = ({children}) => {
    const { loading,user } = useAuth()


    if(loading){
        return (<main><Loader text="Checking authentication..." /></main>)
    }

    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default Protected