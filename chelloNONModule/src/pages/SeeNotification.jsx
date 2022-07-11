import { collection, getDocs, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../firebase"
import { UseAuth } from "./AuthContext"
import DisplayNotification from "./DisplayNotification"
import Navbar from "./Navbar"

export default function SeeNotification(){
    const navigate = useNavigate()
    const {user} =UseAuth()
    const [listOfNotification, setListOfNotification] = useState([])

    const getNotifs = async ()=>{
        const q = query(collection(db, "users", user.uid, "notif"));
        let tempListOfotification = []
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        tempListOfotification.push(doc)
        setListOfNotification(tempListOfotification)
        console.log(listOfNotification);
        });
    }
    useEffect(()=>{
        getNotifs()
    },[])

    return(
        <div>
        <Navbar/>
            <div className="">
            <div className="flex min-h-screen">
                <div className="hidden md:flex md:flex-shrink-0 ">
                <div className="flex flex-col w-64 ">
                <div className="flex flex-col h-0 flex-1">
                    <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1 sticky top-0">
                        <a onClick={()=>navigate(`/home/${user.uid}`)}className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Workspace Gallery
                        </a>
                        <a className="bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Notification
                        </a>
                        <a onClick={()=>navigate(`/favorite`)} className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Favorite Board
                        </a>
                        <a onClick={()=>navigate(`/closed`)} className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Closed Board
                        </a>
                    </nav>
                </div>
                </div>
                </div>
                <div>
                    <DisplayNotification listOfNotification={listOfNotification}/>
                </div>
            </div> 
            </div>
        </div>
    )
}