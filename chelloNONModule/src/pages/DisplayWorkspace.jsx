import { async } from "@firebase/util";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Navigate, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { UseAuth } from "./AuthContext";

export default function DisplayWorkspace({listOfWorkspace, subString}){


    const {user} = UseAuth()
    const navigate = useNavigate()

    const deleteWorkspace = async(wp)=>{
        if(wp.data().workspaceAdmin.length==1){
            const del = doc(db,"workspaces",wp.id);
            await deleteDoc(del)
            console.log("done")
        }
    }

    

    return (
        <div>
        {listOfWorkspace.map((wp)=>{
            if(wp.data().workspaceName.includes(subString)){
                if(wp.data().visibility=="Public" || (wp.data().visibility=="Private"&& (wp.data().workspaceMember.includes(user.uid)))){
                    let delClass = 'hidden'
                    if(wp.data().workspaceAdmin.includes(user.uid)){
                        delClass=''
                    }
                    return(
                        <div className="float-left ml-10 mt-5 rounded shadow-2xl w-64 h-40 bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                <h3 onClick={()=>navigate(`/boardGallery/${wp.id}`)}className="text-base leading-6 font-medium text-gray-900">
                                    {wp.data().workspaceName}
                                </h3>
                                <p className="text-base leading-6 font-small text-gray-900">
                                    {wp.data().visibility}
                                </p>
                                <div className="flex">
                                <button className={delClass} onClick={()=>deleteWorkspace(wp)}>
                                    delete
                                </button>
                                </div>
                            </div>
                    )
                }   
            }
        })}
        </div>
    )
}