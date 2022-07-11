import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { UseAuth } from "./AuthContext";

export default function DisplayMember({workspace,listOfMember}){


    const {user} = UseAuth()
    const [isAdmin, setIsAdmin] = useState()

    const setAsAdmin = async (id) =>{
        const workspaceRef = doc(db,"workspaces", workspace.id)
        await updateDoc(workspaceRef,{
            workspaceAdmin:arrayUnion(id)
        })
    }

    const removeAdminRole = async(id)=>{
        const workspaceRef = doc(db,"workspaces", workspace.id)
        await updateDoc(workspaceRef,{
            workspaceAdmin:arrayRemove(id)
        })
    }

    const removeFromMember = async(id)=>{
        const workspaceRef = doc(db,"workspaces", workspace.id)
        await updateDoc(workspaceRef,{
            workspaceMember:arrayRemove(id)
        })
    }

    useEffect(()=>{
        if(user!=null && workspace!=null){
            if(workspace.data().workspaceAdmin.includes(user.uid)){
                setIsAdmin(true)   
            }
            else{
                setIsAdmin(false)
            }
            console.log(isAdmin)
        }
    },[user, workspace])

    // if(workspace.data().workspaceAdmin.includes(user.uid)){
        console.log(isAdmin);
    if(isAdmin!=undefined){
        return (
            <div>
                {listOfMember.map((mb)=>{
                    if(workspace.data().workspaceAdmin.includes(mb.id) && mb.id!=user.uid && isAdmin==true){
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
                    else if(mb.id == user.uid || !isAdmin){
                        return(
                            <div className="float-left ml-10 mt-5 rounded shadow-2xl w-full h-40 bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                    <h3 className="text-base leading-6 font-medium text-gray-900">
                                        {mb.data().username}
                                    </h3>
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
                })}
             </div>
        )
    }
        
    // }
    // else{
    //     return (
    //         <div>
    //             {listOfMember.map((mb)=>(
    //                         <div className="float-left ml-10 mt-5 rounded shadow-2xl w-full h-40 bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
    //                                 <h3 className="text-base leading-6 font-medium text-gray-900">
    //                                     {mb.data().username}
    //                                 </h3>
    //                             </div>
    //                     )
    //             )}
    //          </div>
    //     )
    // }
}