import { createContext, useContext, useEffect, useState } from "react";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth'
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const UserContext = createContext()

export const AuthContextProvider = ({children}) =>{
    const[user, setUser] = useState({})

    const createUser = async (email, password, username)=>{
        return createUserWithEmailAndPassword(auth, email, password).then(async(e)=>{
            console.log(e)
            const docRef = await setDoc(doc(db, `users/${e.user.uid}`), {
                email: email,
                username: username
            })
        })
    }

    const signIn = (email, password)=>{
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logOut = ()=>{
        return signOut(auth)
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(currentUser)=>{
            console.log(currentUser);
            setUser(currentUser)
        })
        return ()=>{
            unsubscribe()
        }
    },[])
        
    return(
        <UserContext.Provider value={{createUser, user, signIn, logOut}}>
            {children}
        </UserContext.Provider>
    )

    
}

export const UseAuth  =() =>{
    return useContext(UserContext)
}