import { addDoc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { UseAuth } from './AuthContext'

function SignUp(){
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [username, setUsername] = useState()
    const [error,setError] = useState()

    const {createUser,user}= UseAuth()

    const navigate = useNavigate()
    const handleSubmit = async(e)=>{
        e.preventDefault()
        setError('')
        try{
            await createUser(email,password,username)
            navigate(`/home/${user.uid}`)
        }catch(e){
            setError(e.message)
            console.log(e.message)
        }
    }   
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign up
                </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}method="POST">
                <input type="hidden" name="remember" value="true"/>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div className="pb-8 pt-8">
                    <label for="email-address" className="sr-only">Email address</label>
                    <input id="email-address" onChange={(e)=>setEmail(e.target.value)}name="email" type="email" autocomplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address"/>
                    </div>
                    <div className="pb-8">
                    <label for="username" className="sr-only">Username</label>
                    <input id="username" onChange={(e)=>setUsername(e.target.value)}name="username" type="username" autocomplete="username" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="username"/>
                    </div>
                    <div className="pb-8">
                    <label for="password" className="sr-only">Password</label>
                    <input id="password" onChange ={(e)=>setPassword(e.target.value)}name="password" type="password" autocomplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password"/>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <div class="text-sm">
                    <a href="/signIn" class="font-medium text-indigo-600 hover:text-indigo-500">
                        Already have any accounts
                    </a>
                    </div>
                </div>
                <div>
                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        
                    </span>
                    Sign up
                    </button>
                </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp