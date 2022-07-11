import { collection, onSnapshot, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../firebase"


export default function DisplayCard({cardList, setEditCardModal, setEditCard}){
    // useEffect(()=>{
    //     console.log(cardList)
    //     if(cardList.length>0)
    //         console.log(cardList)
    // },[cardList])
    const {workspaceID, boardID} = useParams()
    const [labelList, setLabelList] = useState([])
    const [colorList, setColorList] =useState([])
    useEffect(()=>{
        if(boardID!=undefined){
            let tempLabelList=[]
            let tempColorList = []
            onSnapshot(query(collection(db, "workspaces", workspaceID, "boards", boardID, "labels")),querySnapshot=>{
                querySnapshot.forEach((doc)=>{
                    console.log(doc)
                    tempLabelList.push(doc.id)
                    setLabelList(tempLabelList)
                    tempColorList.push(doc.data().labelColor)
                    setColorList(tempColorList)
                        console.log(colorList)
                        console.log(labelList)
                })
            })
        }
    }, [boardID])
    const editCardPopUp = (card) =>{
        setEditCardModal('fixed z-10 inset-0 overflow-y-auto')
        setEditCard(card)
        console.log(card.data().cardName)
    }

    return (
        <div>
            {cardList.map((card)=>{
                if(card.data().cardLabel==undefined || card.data().cardLabel==''){
                    return( 
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 rounded shadow-2xl border">
                            <p onClick={()=>editCardPopUp(card)}>{card.data().cardName}</p>
                        </div>
                    )
                }
                else{
                    var colorIdx = labelList.findIndex(el=>el==card.data().cardLabel)
                    if(colorList[colorIdx]=="Red"){
                        return(
                            <div style={{backgroundColor: "#f57e7e" }}className="bg-red max-w-7xl mx-auto sm:px-6 lg:px-8 rounded shadow-2xl border">
                                <p onClick={()=>editCardPopUp(card)}>{card.data().cardName}</p>
                            </div>
                        )
                    }
                    else if(colorList[colorIdx]=="Green"){
                        return(
                            <div style={{backgroundColor: "#b6d7a8" }}className="max-w-7xl mx-auto sm:px-6 lg:px-8 rounded shadow-2xl border">
                                <p onClick={()=>editCardPopUp(card)}>{card.data().cardName}</p>
                            </div>
                        )
                    }
                    else if(colorList[colorIdx]=="Yellow"){
                        return(
                            <div style={{backgroundColor: "#fff2cc" }}className="max-w-7xl mx-auto sm:px-6 lg:px-8 rounded shadow-2xl border">
                                <p onClick={()=>editCardPopUp(card)}>{card.data().cardName}</p>
                            </div>
                        )
                    }
                    else if(colorList[colorIdx]=="Blue"){
                        return(
                            <div style={{backgroundColor: "#cfe2f3" }}className="max-w-7xl mx-auto sm:px-6 lg:px-8 rounded shadow-2xl border">
                                <p onClick={()=>editCardPopUp(card)}>{card.data().cardName}</p>
                            </div>
                        )
                    }
                    else if(colorList[colorIdx]=="Purple"){
                        return(
                            <div style={{backgroundColor: "#d9d2e9" }}className="bg-red max-w-7xl mx-auto sm:px-6 lg:px-8 rounded shadow-2xl border">
                                <p onClick={()=>editCardPopUp(card)}>{card.data().cardName}</p>
                            </div>
                        )
                    }
                    else if(colorList[colorIdx]=="Orange"){
                        return(
                            <div style={{backgroundColor: "#f9cb9c" }}className="bg-red max-w-7xl mx-auto sm:px-6 lg:px-8 rounded shadow-2xl border">
                                <p onClick={()=>editCardPopUp(card)}>{card.data().cardName}</p>
                            </div>
                        )
                    }
                }
            }
            )}
        </div>
    )
}