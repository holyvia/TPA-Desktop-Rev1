import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { UseAuth } from "./AuthContext";

export default function DisplayBoard({listOfBoard, searchString}){

    const {workspaceID} = useParams()
    const {user} = UseAuth()
    const navigate = useNavigate()
    const [workspace, setWorkspace] = useState()
    const deleteBoard = async(br)=>{
        if(br.data().boardAdmin.length==1){
            const del = doc(db,"workspaces",workspaceID, "boards", br.id);
            await deleteDoc(del)
            console.log("done")
        }
    }

    const getWorkspace = async()=>{
        const query = doc(db, "workspaces", workspaceID)
        const ws =  await getDoc(query)
        setWorkspace(ws)
        console.log(workspace)
    }

    useEffect(()=>{
        getWorkspace()
        console.log(listOfBoard)
    },[])

    if(workspace!=null){

        return (
            <div>
        {listOfBoard.map((br)=>{
        if(br.data().boardName.includes(searchString)){
            if(((br.data().visibility=="Public" || (br.data().visibility=="Workspace Visibility" && (workspace.data().workspaceMember.includes(user.uid))) || (br.data().visibility=="Board Visibility"&& (br.data().boardMember.includes(user.uid)))) && br.data().status!="closed") ){
                let delClass = 'hidden'
                if(br.data().boardAdmin.includes(user.uid)){
                    delClass=''
                }
                return(
                    <div className="float-left ml-10 mt-5 rounded shadow-2xl w-64 h-40 bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 onClick={()=>navigate(`/cardGallery/${workspaceID}/${br.id}`)}className="text-base leading-6 font-medium text-gray-900">
                                {br.data().boardName}
                            </h3>
                            <p className="text-base leading-6 font-small text-gray-900">
                                {br.data().visibility}
                            </p>
                            <button className={delClass} onClick={()=>deleteBoard(br)}>
                                delete
                            </button>
                        </div>
                )
            }
        }
         })}
        </div>
    )
}
}