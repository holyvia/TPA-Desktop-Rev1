import { async } from "@firebase/util";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase";
import { UseAuth } from "./AuthContext";


export default function Navbar (){

    const [profileExpClass, setProfileExpClass] = useState('hidden px-4 py-2 text-sm text-gray-700')
    const [profileExpand, setProfileExpand] = useState(false)
    const [dropDownClass, setDropDownClass] = useState("hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none")
    const [error, setError] = useState('')
    const {user,logOut}= UseAuth()
    const [defaultProfClass, setDefaultPhotoClass] = useState('h-8 w-8 rounded-full z-10')
    const [profClass, setProfClass] = useState('hidden')
    const [profUrl, setProfUrl] = useState()
    const navigate = useNavigate()
    const goToEditProfile = () =>{
        navigate('/editProfile')
    }

    const getProfile = async()=>{
        const storageRef = ref(storage, `/profilePic/${user.uid}`);
        const url = await getDownloadURL(storageRef)
        setProfUrl(url)
        if(profUrl!=''){
            setDefaultPhotoClass('hidden')
            setProfClass('h-8 w-8 rounded-full')
        }
    }

    useEffect(()=>{
        if(profUrl==undefined){
            getProfile()
        }
    },[profUrl])

    const HandleSignOut = async (e) =>{
        e.preventDefault()
        setError('')
        try{
            await logOut()
            navigate(`/`)
        }catch(e){
            setError(e.message)
            console.log(e.message)
        }
    }

    function profileClicked(){
        if(profileExpand == false){
            setProfileExpand(true)
            setProfileExpClass("block px-4 py-2 text-sm text-gray-700")
            setDropDownClass("origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-40")
            console.log(profileExpand)
        }
        else{
            setProfileExpand(false)
            setProfileExpClass("hidden px-4 py-2 text-sm text-gray-700")
            setDropDownClass("hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none")
            console.log(profileExpand)
        }
    }

    return (
        <div className="sticky top-0">
            <nav className="bg-indigo-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <h2 className="text-white px-3 py-2 rounded-md text-lg font-medium">CHello</h2>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                        <a onClick={()=>navigate(`/home/${user.uid}`)}className="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium">Workspace</a>
    
                        <a href="#" className="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium">Create</a>
    
                        </div>
                    </div>
                    </div>
                    <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                        <button className="p-1 bg-indigo-600 rounded-full text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
                            <span className="sr-only">View notifications</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
    
                        <div className="ml-3 relative">
                        <div>
                            <button type="button"   onClick={profileClicked}  className="max-w-xs bg-indigo-600 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                <span className="sr-only">Open user menu</span>
                                <svg class={defaultProfClass} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <img className={profClass} src={profUrl}></img>
                                {/* <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixqx=nkXPoOrIl0&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/> */}
                            </button>
                        </div>
    
                        <div role="menu" className={dropDownClass} aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                            <button onClick={goToEditProfile} className={profileExpClass} role="menuitem" tabindex="-1" id="user-menu-item-0">EditProfile</button>
    
                            <button onClick={HandleSignOut} className={profileExpClass} role="menuitem" tabindex="-1" id="user-menu-item-2">Sign Out</button>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                    <button type="button" className="bg-indigo-600 inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        
                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
    
                        <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    </div>
                </div>
                </div>
    
                <div className="md:hidden" id="mobile-menu">
                <div className="pt-4 pb-3 border-t border-indigo-700">
                    <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                        <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixqx=nkXPoOrIl0&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                    </div>
                    <div className="ml-3">
                        <div className="text-base font-medium text-white">name</div>
                    </div>
                    <button className="ml-auto bg-indigo-600 flex-shrink-0 p-1 rounded-full text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
                        <span className="sr-only">View notifications</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                    </div>
                    <div className="mt-3 px-2 space-y-1">
                    <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75">Edit Profile</a>
    
                    <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75">Settings</a>
    
                    <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75">Sign out</a>
                    </div>
                </div>
                </div>
            </nav>
    
        </div>
      );
}