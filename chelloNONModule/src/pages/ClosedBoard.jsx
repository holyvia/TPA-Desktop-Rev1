import { async } from "@firebase/util"
import { collection, doc, getDoc, getDocs, onSnapshot, query} from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../firebase"
import { UseAuth } from "./AuthContext"
import DisplayBoard from "./DisplayBoard"
import DisplayNotification from "./DisplayNotification"
import Navbar from "./Navbar"

export default function ClosedBoard(){
    const navigate = useNavigate()
    const {user} =UseAuth()
    const [listOfClosedBoard, setListClosedBoard] = useState([])
    const [listOfClosedBoardData, setListClosedBoardData] = useState([])
    useEffect(()=>{
        if(user.uid!=undefined){
            console.log(user.uid);
            onSnapshot(query(collection(db, "users", user.uid, "closedBoard")),querySnapshot=>{
                setListClosedBoard(querySnapshot.docs)
                console.log(querySnapshot.docs)
            })
        }
    },[user.uid])

    const getBoardData = async()=>{
        let arr = []
        for(var i=0; i<listOfClosedBoard.length; i++){
            console.log(listOfClosedBoard[i].id)
            const a= await getDoc(doc(db, "workspaces", listOfClosedBoard[i].data().workspaceID,"boards", listOfClosedBoard[i].data().boardID))
            arr.push(a)
        }
        setListClosedBoardData(arr)
    }

    useEffect(()=>{
        if(listOfClosedBoard!=undefined){
            getBoardData()

        }
    },[listOfClosedBoard])
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
                        <a onClick={()=>navigate(`/favorite`)} className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Favorite Board
                        </a>
                        <a className="bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Closed Board
                        </a>
                    </nav>
                </div>
                </div>
                </div>
                <div>
                    <h1>
                        Closed Board
                    </h1>
                    {listOfClosedBoardData.map((br)=>(
                        <p>{br.data().boardName}</p>
                    ))}
                </div>
            </div> 
            </div>
        </div>
    )
}