import React, {useRef, useState} from "react"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import app from "../firebase"
import {useNavigate} from "react-router-dom"
import { UseAuth } from "./AuthContext"

function SignIn(){
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const {signIn,user}= UseAuth()

    const handleSubmit = async(e)=>{
        e.preventDefault()
        setError('')
        // console.log(user.uid)
        try{
            await signIn(email,password)
            console.log(user.uid)
            navigate(`/home/${user.uid}`)
        }catch(e){
            setError(e.message)
            console.log(e.message)
        }
    } 

    return (
        <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <div>
                
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in
                </h2>
                </div>
                <form class="mt-8 space-y-6" onSubmit={handleSubmit} method="POST">
                <input type="hidden" name="remember" value="true"/>
                <div class="rounded-md shadow-sm -space-y-px">
                    <div className="pb-8 pt-8">
                        <label for="email-address" class="sr-only">Email address</label>
                        <input id="email-address" onChange={(e)=>setEmail(e.target.value)} name="email" type="email" autocomplete="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address"/>
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input id="password" onChange={(e)=>setPassword(e.target.value)} name="password" type="password" autocomplete="current-password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password"/>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="text-sm">
                    <a href="/" class="font-medium text-indigo-600 hover:text-indigo-500">
                        Don't have any accounts
                    </a>
                    </div>
                </div>

                <div>
                    <button type="submit"  class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                        
                    </span>
                    Sign in
                    </button>
                </div>
                </form>
            </div>
        </div>
    )
}

export default SignIn