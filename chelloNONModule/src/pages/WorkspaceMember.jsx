
import { async } from "@firebase/util"
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../firebase"
import { UseAuth } from "./AuthContext"
import DisplayMember from "./DisplayMember"
import DisplayWorkspace from "./DisplayWorkspace"
import Navbar from "./Navbar"

export default function WorkspaceMember(){
    const {user} = UseAuth()
    const {workspaceID} = useParams()
    const [workspace, setWorkspace] = useState()
    const [listOfMember, setListOfMember] = useState([])
    const navigate = useNavigate()

    const getMembers= async()=>{
        const q = query(doc(db, "workspaces",workspaceID));
        let tempMember = []
        let tempMemberName =[]
        const querySnapshot = await getDoc(q);
        setWorkspace(querySnapshot)
        tempMember = querySnapshot.data().workspaceMember
        console.log(tempMember);
        for(var i=0; i<tempMember.length; i++){
            const qState = query(doc(db,"users", tempMember[i]))
            const qStateSnapShot = await getDoc(qState)
            tempMemberName.push(qStateSnapShot)
        }
        setListOfMember(tempMemberName)
    }


    useEffect(()=>{
        getMembers()
    }, [])

    if(listOfMember.length!=0){
        return(
        <div>
            <Navbar/>
            <div className="">
            <div className="flex min-h-screen">
                <div className="hidden md:flex md:flex-shrink-0 ">
                <div className="flex flex-col w-64 ">
                <div className="flex flex-col h-0 flex-1">
                    <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1 sticky top-0">
                        <a onClick={()=>navigate(`/boardGallery/${workspaceID}`)}className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Board Gallery
                        </a>
                        <a  className="bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        See Workspace Member
                        </a>
                        <a onClick={()=>navigate(`/inviteToWorkspace/${workspaceID}`)}className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        invite to workspace
                        </a>
                        <a className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Notification
                        </a>
                    </nav>
                </div>
                </div>
                </div>
                <div>
                </div>
                <div>
                    <DisplayMember workspace={workspace} listOfMember={listOfMember}/>
                </div>
            </div> 
            </div>
        </div>
    )
    }
    
}