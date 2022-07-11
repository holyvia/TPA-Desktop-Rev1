import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { UseAuth } from "./AuthContext";

export default function DisplayMemberBoard({workspaceID, board,listOfMember}){


    const {user} = UseAuth()

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

    useEffect(()=>{
        console.log(listOfMember)
    },[])

        return (
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
        )
}