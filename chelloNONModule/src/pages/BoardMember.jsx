
import { async } from "@firebase/util"
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../firebase"
import { UseAuth } from "./AuthContext"
import DisplayMember from "./DisplayMember"
import DisplayMemberBoard from "./DisplayMemberBoard"
import DisplayWorkspace from "./DisplayWorkspace"
import Navbar from "./Navbar"

export default function BoardMember(){
    const {user} = UseAuth()
    const {workspaceID, boardID} = useParams()
    const [board, setBoard] = useState()
    const [listOfMember, setListOfMember] = useState([])
    const [listOfId, setListOfId] = useState([])
    const navigate = useNavigate()

    const setAsAdmin = async (id) =>{
        const boardRef = doc(db,"workspaces", workspaceID, "boards",board.id)
        await updateDoc(boardRef,{
            boardAdmin:arrayUnion(id)
        })
    }

    const removeAdminRole = async(id)=>{
        const boardRef = doc(db,"workspaces",workspaceID, "boards",board.id)
        await updateDoc(boardRef,{
            boardAdmin:arrayRemove(id)
        })
    }

    const removeFromMember = async(id)=>{
        const boardRef = doc(db,"workspaces", workspaceID, "boards",board.id)
        await updateDoc(boardRef,{
            boardMember:arrayRemove(id)
        })
    }
    const getMembers= async()=>{
        const q = query(doc(db, "workspaces",workspaceID, "boards", boardID));
        let tempMember = []
        let tempMemberName =[]
        const querySnapshot = await getDoc(q);
        setBoard(querySnapshot)
        console.log(board);
        tempMember = querySnapshot.data().boardMember
        console.log(tempMember);
        for(var i=0; i<tempMember.length; i++){
            const qState = query(doc(db,"users", tempMember[i]))
            const qStateSnapShot = await getDoc(qState)
            tempMemberName.push(qStateSnapShot)
            setListOfMember(tempMemberName)
        }
        console.log(listOfMember.length);
    }


    useEffect(()=>{
        let tempMember = []
        
        if(boardID!=undefined){
            onSnapshot(query(doc(db, "workspaces",workspaceID, "boards", boardID)),querySnapshot=>{
                setBoard(querySnapshot)
                tempMember = querySnapshot.data().boardMember
                setListOfId(tempMember)
            })
        }
        console.log(listOfId)
    }, [boardID])
        useEffect(()=>{
            console.log(listOfId)
            if(listOfId.length!=0){
                getUsername()
            }
    }, [listOfId])

    let tempMemberName =[]
    const getUsername= async()=>{
        for(var i=0; i<listOfId.length; i++){
            console.log("getUsername")
            const a = await getDoc(doc(db,"users", listOfId[i]))
            tempMemberName.push(a)
            console.log(tempMemberName[0].data());
        }
        setListOfMember(tempMemberName)
    }

    // useEffect(()=>{
    //     getMembers()
    // }, [])

    // useEffect(()=>{
    //     onSnapshot(doc(db,"workspaces", workspaceID, "boards", boardID), querySnapshot=>{
    //         let Members=[]
    //         Members = querySnapshot.data().boardMember
    //         console.log(Members);
    //         setListOfMember(Members)
    //     })
    // })
    // if(listOfMember.length!=0){
        // console.log(listOfMember);
        console.log(board)
    return(
        <div>
            <Navbar/>
            <div className="">
            <div className="flex min-h-screen">
                <div className="hidden md:flex md:flex-shrink-0 ">
                <div className="flex flex-col w-64 ">
                <div className="flex flex-col h-0 flex-1">
                    <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1 sticky top-0">
                        <a onClick={()=>navigate(`/cardGallery/${workspaceID}/${boardID}`)}className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        List Gallery
                        </a>
                        <a  className="bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        See Board Member
                        </a>
                        <a onClick={()=>navigate(`/inviteToBoard/${workspaceID}/${boardID}`)}className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        invite to board
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
                {listOfMember.map((mb)=>{
                if(board.data().boardAdmin.includes(user.uid)){
                    if(board.data().boardAdmin.includes(mb.id)){
                        return(
                                <div className="float-left ml-10 mt-5 rounded shadow-2xl w-full h-40 bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                        <h3 className="text-base leading-6 font-medium text-gray-900">
                                            {mb.data().username}
                                        </h3>
                    
                                        <button onClick={()=>removeAdminRole(mb.id)}class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                                            remove admin role
                                        </button>
                                    </div>
                        )
                    }
                    else{
                        return(
                            <div className="float-left ml-10 mt-5 rounded shadow-2xl w-full h-40 bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                <h3 className="text-base leading-6 font-medium text-gray-900">
                                    {mb.data().username}
                                </h3>
            
                                <button onClick={()=>setAsAdmin(mb.id)} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                                    set as admin
                                </button>
        
                                <button onClick={()=>removeFromMember(mb.id)}class=" bg-red mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                                    remove
                                </button>
                            </div>
                        )
                    }
                }
                else{
                    if(board.data().boardAdmin.includes(mb.id)){
                        return(
                                <div className="float-left ml-10 mt-5 rounded shadow-2xl w-full h-40 bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                        <h3 className="text-base leading-6 font-medium text-gray-900">
                                            {mb.data().username}
                                        </h3>
                    
                                        <p> Admin </p>
                                    </div>
                        )
                    }
                    else{
                        return(
                            <div className="float-left ml-10 mt-5 rounded shadow-2xl w-full h-40 bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                <h3 className="text-base leading-6 font-medium text-gray-900">
                                    {mb.data().username}
                                </h3>
            
                            </div>
                        )
                    }
                }
            })}
                </div>
            </div> 
            </div>
        </div>
    )
    // }
}