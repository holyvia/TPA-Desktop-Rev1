import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import DisplayCard from "./DisplayCard";


export default function CardElement({listID, setEditCardModal, setEditCard}){
    const {workspaceID, boardID} = useParams()
    const [cardList, setCardList] = useState([])

    const getCardList  =async ()=>{
        let tempCardList = []
        console.log()
        const ref = query(collection(db, "workspaces", workspaceID, "boards", boardID, "lists", listID,"cards"))
        const querySnap = await getDocs(ref)
        querySnap.forEach(e=>{
            console.log(e)
            tempCardList.push(e)
            setCardList(tempCardList)
            console.log(cardList)
        })
        console.log(cardList)
    }

    useEffect(()=>{
        // console.log(listID)
        // if(listID!=''){
            console.log(listID)
            getCardList()
        // }
    },[listID])

    useEffect(()=>{
        if(listID!=undefined){
            onSnapshot(collection(db,"workspaces",workspaceID, "boards", boardID, "lists", listID,"cards"), querySnapshot=>{
                const cards = []
                querySnapshot.forEach(cr=>{
                    cards.push(cr)
                })
                setCardList(cards)
            })
        }
    },[listID])

    return (
        <div>
            <DisplayCard cardList={cardList} setEditCardModal={setEditCardModal} setEditCard={setEditCard}/>
        </div>
    )
}