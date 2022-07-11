import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { UseAuth } from "./AuthContext";

export default function DisplayBoard({listOfBoard, searchString}){

    const {user} = UseAuth()
    const navigate = useNavigate()

    useEffect(()=>{
        console.log(listOfBoard)
    },[])

    if(workspace!=null){

        return (
            <div>
        {listOfBoard.map((br)=>{
        if(br.data().boardName.includes(searchString)){
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
                        </div>
                )
        }
         })}
        </div>
    )
}
}