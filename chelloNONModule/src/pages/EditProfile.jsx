import { async } from "@firebase/util";
import { EmailAuthCredential, EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword, updateEmail, updatePassword } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useContext, useEffect, useRef, useState } from "react";
import { auth, db, storage } from "../firebase";
import { UseAuth } from "./AuthContext";
import Navbar from "./Navbar";

export default function EditProfile(){
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [frequency, setFrequency] = useState('')
    const [defaultPhotoClass, setDefaultPhotoClass] = useState('h-full w-full text-gray-300')
    const [photoUrl, setPhotoUrl] = useState('')
    const [photoClass, setPhotoClass] = useState('')
    const [inputFile, setInputFile] = useState(null) 
    const [oldPassword, setOldPassword] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const {signIn,user} = UseAuth()
    const freqOption = ["Every day", "Every Week", "Every Month", "Never"]
    const handleSubmit = async()=>{
        
        const cred = EmailAuthProvider.credential(email,oldPassword)
        console.log(cred);
        try{
            console.log(email, password);
            await reauthenticateWithCredential(user, cred)
            await updateEmail(user, newEmail)
            await updatePassword(user, password)
            console.log("update done")
            // await signIn(newEmail, password)
            const userRef = doc(db,"users", user.uid)
            await setDoc(userRef,{
                email:newEmail,
                frequency:frequency,
                username:username
            })
        }catch(error){
            console.log(error);
        }
        const userRef = doc(db,"users", user.uid)
        await updateDoc(userRef,{
            frequency:frequency,
            username:username
        })
        if(inputFile!=null){
            updatePhoto()
        }
    }

    const updatePhoto = async ()=>{
        const storageRef = ref(storage, `profilePic/${user.uid}`);
        await uploadBytes(storageRef, inputFile)
        const url = await getDownloadURL(storageRef)
        setPhotoUrl(url)
        setDefaultPhotoClass("hidden")
        setPhotoClass('h-full text-gray-300')
    }

    const setPhotoProfile= async ()=>{
        const storageRef = ref(storage, `profilePic/${user.uid}`);
        const url = await getDownloadURL(storageRef)
        if(url!=null){
            setPhotoUrl(url)
            setDefaultPhotoClass("hidden")
            setPhotoClass('h-full text-gray-300 justify-self-center')
        }
    }

    const getUserData = async()=>{
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap!=undefined){
            setEmail(docSnap.data().email)
            setUsername(docSnap.data().username)
            console.log(email,username);
            if(docSnap.data().frequency!=undefined){
                setFrequency((docSnap.data().frequency))
            }
            else{
                setFrequency("Every week")
            }
        }
    }

    useEffect(()=>{
        getUserData()
        setPhotoProfile()
    },[])

    return(
        <React.Fragment>
        <Navbar/>
        <form id="updateForm" class="space-y-8 divide-y divide-gray-200 w-5/6 pl-40" >
            <div class="pt-20 space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Edit Profile
                    </h3>
                </div>
                <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label for="username" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        Username
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <input type="text" onChange={(e)=>setUsername(e.target.value)} name="username" id="username" autocomplete="username" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder={username}/>
                    </div>
                    </div>

                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
                    <label for="photo" class="block text-sm font-medium text-gray-700">
                        Photo
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <div class="flex items-center">
                        <span class="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                            <svg class={defaultPhotoClass} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <img src={photoUrl} alt="" className={photoClass}/>
                        </span>
                        
                        <input type='file' id='file' onChange={(e)=>{setInputFile(e.target.files[0])}}/> 
                        </div>
                    </div>
                    </div>

                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label for="NotificationFrequency"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        Notification Frequency
                    </label>
                    <div>
                    <select id="NotificationFrequency" value={frequency} onChange={(e)=>setFrequency(e.target.value)} name="NotificationFrequency" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="Every day">Every day</option>
                        <option value="Every week" selected>Every week</option>
                        <option value="Every month" >Every month</option>
                        <option value="Never" >Never</option>
                    </select>
                    </div>
                    </div>

                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label for="Email"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        Email
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <input type="text" onChange={(e)=>setNewEmail(e.target.value)} name="email" id="email" autocomplete="email" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder={email}/>
                    </div>
                    </div>

                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label for="password"class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        Old Password
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <input type="password"  onChange={(e)=>setOldPassword(e.target.value)}  name="OldPassword" id="OldPassword" autocomplete="OldPassword" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2"/>
                    </div>
                    </div>

                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label for="password"class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                        New Password
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                        <input type="password"  onChange={(e)=>setPassword(e.target.value)}  name="password" id="password" autocomplete="password" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2"/>
                    </div>
                    </div>
                </div>

            </div>

            <div class="pt-5">
                <div class="flex justify-end">
                <button type="button" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Cancel
                </button>
                <button form="updateForm" type="button" onClick={handleSubmit} class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Save
                </button>
                </div>
            </div>
        </form>
        </React.Fragment>
    )
}