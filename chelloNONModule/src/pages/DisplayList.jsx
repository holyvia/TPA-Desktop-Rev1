import { async } from "@firebase/util";
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { UseAuth } from "./AuthContext";
import CardElement from "./CardElement";
import DisplayCard from "./DisplayCard";

export default function DisplayList({listOfList, setEditCardModal, setSelectedList, setEditCard}){

    const {user} = UseAuth()
    const navigate = useNavigate()
    const {workspaceID, boardID} = useParams()
    const [listTitle, setListTitle] = useState('')
    const [innerCardList, setInnerCardList] = useState([])
    const [flag,setFlag] = useState(false)
    let tempcardOuterArray = []

    const createList = async()=>{
        await addDoc(collection(db,"workspaces",workspaceID, "boards",boardID, "lists" ), {
            title:listTitle
        });
    }

    const deleteList = async(li)=>{
        const del = doc(db,"workspaces",workspaceID, "boards", boardID, "lists", li.id);
        await deleteDoc(del)
        console.log("done")
    }

    const getCard = async () =>{
    
    }

    useEffect(()=>{
        // getCard()
    },[])

        return (
            <div className="flex">
            {listOfList.map((li,index)=>(
                <div onClick={()=>setSelectedList(li)} className="ml-10 mt-5 rounded shadow-2xl w-64 h-40 bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-base leading-6 font-medium text-gray-900">
                        {li.data().title}
                    </h3>
                    <CardElement listID={li.id} setEditCardModal={setEditCardModal} setEditCard={setEditCard}/>
                    <button onClick={()=>deleteList(li)}>
                        delete list
                    </button>
                </div>
            ))}

            </div>
        )

    
}