import { collection, doc, getDoc, getDocs, onSnapshot, query, QuerySnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../firebase"
import { UseAuth } from "./AuthContext"
import DisplayNotification from "./DisplayNotification"
import Navbar from "./Navbar"

export default function FavoriteBoard(){
    const navigate = useNavigate()
    const {user} =UseAuth()
    const [listOfFavoriteBoard, setListOfFavoriteBoard] = useState([])
    const [listOfFavoriteBoardData, setListFavoriteBoardData] = useState([])
    useEffect(()=>{
        if(user.uid!=undefined){
            console.log(user.uid);
            onSnapshot(query(collection(db, "users", user.uid, "favoriteBoard")),querySnapshot=>{
                setListOfFavoriteBoard(querySnapshot.docs)
                console.log(querySnapshot.docs)
            })
        }
    },[user.uid])

    const getBoardData = async()=>{
        let arr = []
        for(var i=0; i<listOfFavoriteBoard.length; i++){
            console.log(listOfFavoriteBoard[i].id)
            const a= await getDoc(doc(db, "workspaces", listOfFavoriteBoard[i].data().workspaceID,"boards", listOfFavoriteBoard[i].data().boardID))
            arr.push(a)
            console.log(a.data().boardName)
        }
        setListFavoriteBoardData(arr)
    }

    useEffect(()=>{
        if(listOfFavoriteBoard!=undefined){
            getBoardData()

        }
    },[listOfFavoriteBoard])
    console.log(user.uid)

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
                        <a onClick={()=>navigate(`/notif`)}className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Notification
                        </a>
                        <a  className="bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Favorite Board
                        </a>
                        <a onClick={()=>navigate('/closed')}className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Closed Board
                        </a>
                    </nav>
                </div>
                </div>
                </div>
                <div>
                    {listOfFavoriteBoardData.map((br, idx)=>(
                        <div onClick={()=>navigate(`/boardGallery/${listOfFavoriteBoard[idx].data().workspaceID}`)} className="float-left ml-10 mt-5 rounded shadow-2xl w-64 h-40 bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                            <p className="text-base leading-6 font-medium text-gray-900">{br.data().boardName}</p>
                            <p>{br.data().visibility}</p>
                        </div>
                    ))}
                </div>
            </div> 
            </div>
        </div>
    )
}