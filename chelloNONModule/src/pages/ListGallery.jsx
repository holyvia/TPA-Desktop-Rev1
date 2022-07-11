
import { async } from "@firebase/util"
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore"
import { getDownloadURL, list, ref, uploadBytes } from "firebase/storage"
import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { db, storage } from "../firebase"
import { UseAuth } from "./AuthContext"
import DisplayBoard from "./DisplayBoard"
import DisplayList from "./DisplayList"
import DisplayWorkspace from "./DisplayWorkspace"
import Navbar from "./Navbar"
import Progress_bar from "./Progress_bar"

export default function  ListGallery(){
    const {user} = UseAuth()
    const {workspaceID, boardID, listID, cardID} = useParams()
    const navigate = useNavigate()
    const [listOfList, setListOfList]= useState([])
    const [cardName, setCardName] = useState('aa')
    const [cardDescription, setCardDescription] = useState('aa')
    const [creatingModal, setCreatingModal]= useState('hidden')
    const [creatingModal2, setCreatingModal2] =useState('hidden')
    const [currList, setCurrList] = useState()
    const [cardList, setCardList]= useState([])
    const [listName, setListName] =useState('')
    const [innerCardList, setInnerCardList] = useState([])
    const [selectedList, setSelectedList] = useState('')
    const [newCardList, setNewCardList] = useState('')
    const [board, setBoard] = useState()
    const [buttonClass, setButtonClass] = useState()
    const [editCardModal, setEditCardModal] = useState('hidden')
    const [editCardName, setEditCardName]=useState('aa')
    const [editCardDescription, setEditCardDescription] = useState('aa')
    const [editCard, setEditCard]= useState()
    const [listOfLabel, setListOfLabel]= useState([])
    const [edittedLabel, setEdittedLabel] = useState('')
    const [createLabelModal,setCreateLabelModal] = useState('hidden')
    const [labelName, setLabelName] = useState('')
    const [labelColor, setLabelColor] = useState('Red')
    const [checkListItem, setCheckListItem] =useState([])
    const [tempItem, setTempItem] = useState('')
    const [createChecklistModal, setChecklistModal] = useState('hidden')
    const [checklistName, setChecklistName] = useState('')
    const [itemValue, setItemValue] = useState([])
    const [currChecklist, setCurrChecklist] = useState([])
    const [checklistValue,setChecklistValue] = useState([])
    const [inputFile, setInputFile] = useState()
    const [attachmentCount, setAttachmentCount] = useState()
    const [viewFileModal, setViewFilesModal] = useState('hidden')
    const [attachmentList, setAttachmentList] = useState([])
    const [attachmentLink, setAttachmentLink] = useState('')
    const [long, setLongitude] = useState('')
    const [lat, setLatitude] = useState('')
    const [addLocModal, setAddLocModal] = useState('hidden')
    const [dueDate, setDueDate] = useState()
    const [viewChecklistModal, setViewChecklistModal] = useState('hidden')
    const [boardMember, setBoardMember] = useState([])
    const [cardWatcherModal, setCardWatcherModal] = useState('hidden')
    const [viewCardWatcherModal, setViewCardWatcherModal] = useState('hidden')
    const [cardWatcher, setCardWatcher] = useState([])
    const [addedCardWatcher, setAddedCardWatcher] = useState('')
    const [cardLink, setCardLink]= useState('')
    const [wsID, setwsID] = useState('')
    const [brID, setbrID] = useState('')
    const [commentView, setCommentView] = useState('hidden')
    const [cardComment, setCardComment] = useState('')
    const [comments, setComments] = useState([])
    let tempItemValue = []
    let tempCheckListItem = []
    let tempcardOuterArray = []

    const createChecklist = async()=>{
        await addDoc(collection(db, "workspaces", workspaceID, "boards", boardID, "lists", selectedList.id, "cards", editCard.id,"checklists"),{
            checklistName:checklistName,
            checklistItem: checkListItem,
            itemvalue:new Array(checkListItem.length).fill(false)
        })
        tempItemValue = []
        tempCheckListItem = []
        setChecklistName('')
        setCheckListItem([])
        setChecklistModal('hidden')
    }

    const createLabel = async () =>{
        await addDoc(collection(db, "workspaces", workspaceID, "boards", boardID, "labels"), {
            labelName:labelName,
            labelColor:labelColor
        })
        setCreateLabelModal('hidden')
    }

    const generateCardLink = async ()=>{
        setwsID(workspaceID)
        setbrID(boardID)
        console.log(wsID);
        console.log(brID);
        setCardLink(workspaceID+'/'+boardID+'/'+selectedList.id+'/'+editCard.id)
        console.log(cardLink);
    }

    const addCardWatcher = async ()=>{
        console.log(addedCardWatcher);
        console.log(cardWatcher);
        if(!cardWatcher.includes(addedCardWatcher)){
            let a = cardWatcher
            a.push(addedCardWatcher)
            setCardWatcher(a)
        }
        console.log(cardWatcher);
        setCardWatcherModal('hidden')
    }

    const uploadFile = async()=>{
        console.log("upload")
        console.log(inputFile)
        setAttachmentCount(attachmentCount+1)
        const storageRef = ref(storage, `attachment/${editCard.id}/${attachmentCount}`);
        await uploadBytes(storageRef, inputFile)
        const url = await getDownloadURL(storageRef)
        await updateDoc(doc(db, "workspaces", workspaceID, "boards", boardID, "lists", selectedList.id, "cards", editCard.id),{
            attachment:arrayUnion(url)
        }).then(alert("uploaded"))
    }

    useEffect(()=>{
        if(cardID!=undefined && listID!=undefined){
            console.log(cardID);
            console.log(listID);
            onSnapshot(query(doc(db, "workspaces", workspaceID, "boards", boardID,"list", listID, "cards", cardID)), querySnapshot=>{
                setEditCard(querySnapshot)
            })
        }
    }, [cardID])

    // useEffect(()=>{
    //     if(editCard!=undefined){
    //         setEditCardName(editCard.data().cardName)
    //         setEditCardDescription(editCard.data().cardDescription)
    //         setEdittedLabel(editCard.data().cardLabel)
    //         setNewCardList(selectedList.id);
    //         if(editCard.data().attachment!=undefined){

    //             setAttachmentList(editCard.data().attachment)
    //         }
    //         let tempChecklistValue = []
    //         onSnapshot(query(collection(db, "workspaces", workspaceID, "boards", boardID, "lists", selectedList.id, "cards", editCard.id, "checklists")), querySnapshot=>{
    //             if(querySnapshot.docs!=undefined){
    //             console.log(querySnapshot.docs);
    //             setCurrChecklist(querySnapshot.docs)
    //             console.log(currChecklist);
    //                 for(var i=0; i<currChecklist.length; i++){
    //                     tempChecklistValue.push(currChecklist[i].itemValue)
    //                 }
    //                 setChecklistValue(tempChecklistValue)
    //                 console.log(checklistValue);
    //             }
    //             // setListOfLabel(querySnapshot)
    //         })
    //         if(editCard.data().attachment!=undefined){
    //             setAttachmentCount(editCard.data().attachment.length)
    //         }
    //         else{
    //             setAttachmentCount(0)
    //         }
    //         if(editCard.data().dueDate!=undefined){
    //             setDueDate(editCard.data().dueDate)
    //         }
    //         if(editCard.data().long!=undefined){
    //             setLongitude(editCard.data().long)
    //             setLatitude(editCard.data().lat)
    //         }
    //         if(editCard.data().cardWatcher!=undefined){
    //             setCardWatcher(editCard.data().cardWatcher)
    //         }
    //     }
    //     setEditCardModal('fixed z-10 inset-0 overflow-y-auto')
    // }, [cardID, editCard])


    // const getList = async() =>{
    //     // const qstate = query(collection(db, "workspaces", workspaceID, "boards", boardID, "lists"))
    //     // let tempList = []
    //     // const snap = await getDocs(qstate)
    //     // snap.forEach(doc=>{
    //     //     tempList. push(doc)
    //     //     setListOfList(tempList)
    //     // })
    //     // console.log(listOfList);
    //     onSnapshot(query(collection(db, "workspaces", workspaceID, "boards", boardID, "lists")), querySnapshot=>{
    //         setListOfList(querySnapshot)
    //     })
    // }

    // useEffect(()=>{
    //     getList()
    // },[])

    // useEffect(()=>{
    //     setCardList(tempcardOuterArray)
    // },[tempcardOuterArray])

    useEffect(()=>{
        if(boardID!=undefined){
        onSnapshot(collection(db,"workspaces", workspaceID, "boards", boardID, "lists"), querySnapshot=>{
                    const Lists = []
                    querySnapshot.forEach(li=>{
                        Lists.push(li)
                    })
                    setListOfList(Lists)
                })
    }
    },[boardID])


    const addLinkAttachment =  async () =>{
        console.log(attachmentLink)
        await updateDoc(doc(db, "workspaces", workspaceID, "boards", boardID, "lists", selectedList.id, "cards", editCard.id),{
            attachment:arrayUnion(attachmentLink)
        }).then(alert("link added"))
        setAttachmentLink('')
    }

    const createCard = async ()=>{
        console.log(selectedList)
        await addDoc(collection(db,"workspaces",workspaceID, "boards", boardID, "lists", selectedList, "cards"), {
            cardName: cardName,
            cardDescription: cardDescription,
            cardWatcher:[user.uid],
            dueDate:new Date()
          });
        setCreatingModal2('hidden')
    }


    const updateCard2 = async ()=>{
        console.log(editCard.id)
        console.log(dueDate);
        console.log(new Date().getFullYear());

        await updateDoc(doc(db, "workspaces", workspaceID, "boards", boardID, "lists", selectedList.id, "cards", editCard.id),{
            cardName: editCardName,
            cardDescription:editCardDescription,
            cardLabel: edittedLabel,
            longitude:long,
            latitude:lat,
            dueDate:dueDate,
            cardWatcher:cardWatcher
        })
        if(selectedList.id!=newCardList){
            const document = await getDoc(doc(db, "workspaces", workspaceID, "boards", boardID, "lists", selectedList.id, "cards", editCard.id))
            await setDoc(doc(db, "workspaces", workspaceID, "boards", boardID, "lists", newCardList, "cards", editCard.id), document.data())     
            deleteDoc(doc(db, "workspaces", workspaceID, "boards", boardID, "lists", selectedList.id, "cards", editCard.id))
        }
    }

    const updateCard = async ()=>{
        setCardDescription(editCardDescription)
        setCardName(editCardName)
        await updateCard2()
        setEditCardModal('hidden')
    }

    const createList = async ()=>{
        await addDoc(collection(db,"workspaces",workspaceID, "boards", boardID, "lists"), {
            title: listName
          });
        setCreatingModal('hidden')
    }

    const addItem = async()=>{
        tempCheckListItem = checkListItem
        tempCheckListItem.push(tempItem)
        tempItemValue.push(false)
        setCheckListItem(tempCheckListItem)
        console.log(tempItemValue);
        setItemValue(tempItemValue)
        setTempItem('')
    }

    const addComment = async ()=>{
        console.log(editCard);
        await addDoc(collection(db, "workspaces", workspaceID, "boards", boardID, "lists", selectedList.id, "cards", editCard.id, "comments"),{
            content:cardComment
        })
        await addDoc(collection(db, "users", user.uid, "notif"), {
            content:"Comment added in board "+ board.data().boardName
        })
        setCardComment('')
    }

    useEffect(()=>{
        if(selectedList!=undefined && editCard!=undefined){
            console.log(selectedList)
            console.log(editCard);
            onSnapshot(query(collection(db, "workspaces", workspaceID, "boards", boardID, "lists", selectedList.id, "cards", editCard.id, "comments")),querySnapshot=>{
                let tempComment =[]
                querySnapshot.forEach((a)=>(
                    tempComment.push(a)
                ))
                setComments(tempComment)
            })
        }
    }, [selectedList, editCard])

    useEffect(()=>{
        onSnapshot(query(doc(db, "workspaces", workspaceID, "boards", boardID)), querySnapshot=>{
            setBoard(querySnapshot)
            console.log(querySnapshot.data().boardMember)
            setBoardMember(querySnapshot.data().boardMember)
        })
        if(cardID!=undefined){
            console.log(cardID);
        }
    },[])

    useEffect(()=>{
        if(board!=null){
            console.log(board.data())
            if(board.data().boardMember.includes(user.uid)){
                setButtonClass('inline-flex items-center px-4 py-2 ml-4 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500')
            }
            else{
                setButtonClass('hidden')
            }
        }
    }, [board])

    useEffect(()=>{
        if(editCard!=undefined){
            setEditCardName(editCard.data().cardName)
            setEditCardDescription(editCard.data().cardDescription)
            setEdittedLabel(editCard.data().cardLabel)
            setNewCardList(selectedList.id);
            if(editCard.data().attachment!=undefined){

                setAttachmentList(editCard.data().attachment)
            }
            let tempChecklistValue = []
            onSnapshot(query(collection(db, "workspaces", workspaceID, "boards", boardID, "lists", selectedList.id, "cards", editCard.id, "checklists")), querySnapshot=>{
                if(querySnapshot.docs!=undefined){
                console.log(querySnapshot.docs);
                setCurrChecklist(querySnapshot.docs)
                console.log(currChecklist);
                    for(var i=0; i<currChecklist.length; i++){
                        tempChecklistValue.push(currChecklist[i].itemValue)
                    }
                    setChecklistValue(tempChecklistValue)
                    console.log(checklistValue);
                }
                // setListOfLabel(querySnapshot)
            })
            if(editCard.data().attachment!=undefined){
                setAttachmentCount(editCard.data().attachment.length)
            }
            else{
                setAttachmentCount(0)
            }
            if(editCard.data().dueDate!=undefined){
                setDueDate(editCard.data().dueDate)
            }
            if(editCard.data().long!=undefined){
                setLongitude(editCard.data().long)
                setLatitude(editCard.data().lat)
            }
            if(editCard.data().cardWatcher!=undefined){
                setCardWatcher(editCard.data().cardWatcher)
            }
        }
        console.log(cardWatcher)
    }, [editCard])

    useEffect(()=>{
        if(boardID!=undefined){
            onSnapshot(query(collection(db, "workspaces", workspaceID, "boards", boardID, "labels")), querySnapshot=>{
                let tempLabel = []
                console.log(querySnapshot);
                querySnapshot.forEach((doc)=>{
                    tempLabel.push(doc)
                })
                // setListOfLabel(querySnapshot)
                setListOfLabel(tempLabel)
            })
        }
    }, [boardID])

    useEffect(()=>{
        setTempItem('')
    }, [checkListItem])

    

    return(
        <div>
            <Navbar/>
            <div class={creatingModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Create New List</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="CardName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                List Name
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" onChange={(e)=>setListName(e.target.value)} name="CardName" id="CardName" autocomplete="CardName" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" List Name" />
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={createList} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    create
                    </button>
                </div>
                </div>
            </div>
            </div> 

            {/* <div class={editCardModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Edit Card</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="CardName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Name
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" value={editCardName} onChange={(e)=>setEditCardName(e.target.value)} name="CardName" id="CardName" autocomplete="CardName" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" Card Name" />
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="CardName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Description
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" value={editCardDescription} onChange={(e)=>setEditCardDescription(e.target.value)} name="CardName" id="CardName" autocomplete="CardName" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" Card Description" />
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="label"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Label
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                            <select id="label" value={edittedLabel}onChange={(e)=>setEdittedLabel(e.target.value)} name="label" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="">none</option>
                                {listOfLabel.map((label) => (
                                    <option value={label.id}>{label.data().labelName}</option>
                                ))}
                            </select>
                            <button onClick={()=>setCreateLabelModal('fixed z-10 inset-0 overflow-y-auto')}>createLabel</button>
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="label"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card List
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <select id="label" value={newCardList}onChange={(e)=>setNewCardList(e.target.value)} name="label" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                        {listOfList.map((list) => (
                                            <option value={list.id}>{list.data().title}</option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="label"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Checklist
                            </label>
                            <button>Add Checklist</button>
                        </div>
                        <Progress_bar bgcolor="#7234ff" progress='50'  height={30} />
                    </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={updateCard} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    update
                    </button>
                </div>
                </div>
            </div>
            </div>  */}
            <div class={editCardModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-10 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Edit Card</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 ">
                            <label for="CardName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Name
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" value={editCardName} onChange={(e)=>setEditCardName(e.target.value)} name="CardName" id="CardName" autocomplete="CardName" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" Card Name" />
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200">
                            <label for="CardName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Description
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" value={editCardDescription} onChange={(e)=>setEditCardDescription(e.target.value)} name="CardName" id="CardName" autocomplete="CardName" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" Card Description" />
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200">
                            <label for="label"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Label
                            </label>
                            <div class="flex">
                            <select id="label" value={edittedLabel}onChange={(e)=>setEdittedLabel(e.target.value)} name="label" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="">none</option>
                                {listOfLabel.map((label) => (
                                    <option value={label.id}>{label.data().labelName}</option>
                                ))}
                            </select>
                            <button onClick={()=>setCreateLabelModal('fixed z-10 inset-0 overflow-y-auto')}class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">createLabel</button>
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200">
                            <label for="label"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card List
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <select id="label" value={newCardList}onChange={(e)=>setNewCardList(e.target.value)} name="label" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                        {listOfList.map((list) => (
                                            <option value={list.id}>{list.data().title}</option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200">
                            <label for="attachment" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Attachment
                            </label>
                            <div class="flex" style={{width:"100vh"}}>
                            <input type='text' value={attachmentLink} onChange={(e)=>setAttachmentLink(e.target.value)}/>
                            <input type='file' id='file' onChange={(e)=>{setInputFile(e.target.files[0])}}/>
                            <button onClick={addLinkAttachment}class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">add link</button>
                            <button onClick={uploadFile}class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">upload File</button>
                            <button onClick={()=>setViewFilesModal('fixed z-10 inset-0 overflow-y-auto')}class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-smpy-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">uploaded file</button>
                            </div>
                        </div>

                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 ">
                            <label for="CardLoc"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Location
                            </label>
                            <div className="flex">

                            <button onClick={()=>setAddLocModal('fixed z-10 inset-0 overflow-y-auto')}class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">add location</button>
                            <button onClick={()=>window.open(`https://maps.google.com/?q=${lat},${long}`)}class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">view location</button>

                            </div>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                            </div>
                        </div>

                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 ">
                            <label for="CardDate"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Due Date
                            </label>
                            <div className="flex">
                            <input type="date" name="dueDate" id="dueDate" onChange={(e)=>setDueDate(e.target.value)}/>
                            </div>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                            </div>
                        </div>

                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200">
                            <label for="label"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Checklist
                            </label>
                            <div className="flex">
                           
                            <button onClick={()=>setChecklistModal('fixed z-10 inset-0 overflow-y-auto')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">Add Checklist</button>
                            <button onClick={()=>setViewChecklistModal('fixed z-10 inset-0 overflow-y-auto')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">View Checklist</button>
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200">
                            <label for="cardWatcher"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Watcher
                            </label>
                            <div class="flex">
                                <button onClick={()=>setCardWatcherModal('fixed z-10 inset-0 overflow-y-auto')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">Add Card Watcher</button>
                                <button onClick={()=>setViewCardWatcherModal('fixed z-10 inset-0 overflow-y-auto')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">View Card Watcher</button>
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200">
                            <label for="cardLink"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Link
                            </label>
                            <div>
                                <p>{cardLink}</p>
                                <button onClick={generateCardLink} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">Generate Link</button>
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200">
                            <label for="cardComment"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Comment
                            </label>
                            <div>
                                <button onClick={()=>setCommentView('fixed z-10 inset-0 overflow-y-auto')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">View Comment</button>
                            </div>
                        </div>


                    </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={updateCard} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    update
                    </button>
                    <button type="submit" onClick={()=>setEditCardModal('hidden')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    cancel
                    </button>
                </div>
                </div>
            </div>
            </div> 

            <div class={commentView} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>View Comment</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        {comments.map((a)=>(
                            <div>

                            {/* <h1>Document {idx+1}</h1> */}
                            <p>{a.data().content}</p>
                            </div>
                        ))}
                    </div>
                    </div>
                </div>
                
                <input type="text" value={cardComment} onChange={(e)=>setCardComment(e.target.value)} name="Comment" id="Comment" autocomplete="Comment" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" New Comment" />
                

                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={addComment} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    Add Comment
                    </button>
                    <button type="submit" onClick={()=>setCommentView('hidden')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    Done
                    </button>
                </div>
                </div>
            </div>
            </div> 


            <div class={cardWatcherModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Add Card Watcher</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="cardWatcher"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Select Card Watcher
                            </label>
                            <select id="cardWatcher" value={addedCardWatcher}onChange={(e)=>setAddedCardWatcher(e.target.value)} name="cardWatcher" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="">none</option>
                                {boardMember.map((mem) => (
                                    <option value={mem}>{mem}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="button" onClick={addCardWatcher} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    Add Card Watcher
                    </button>
                    <button type="button" onClick={()=>setCardWatcherModal('hidden')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    Cancel
                    </button>
                </div>
                </div>
            </div>
            </div> 

            <div class={viewCardWatcherModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Card Watcher</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="cardWatcher"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Select Card Watcher
                            </label>
                            {cardWatcher.map((cw) => (
                                    <p>{cw}</p>
                                ))}
                        </div>
                    </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="button" onClick={()=>setViewCardWatcherModal('hidden')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    close
                    </button>
                </div>
                </div>
            </div>
            </div> 


            <div class={createLabelModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Add Label</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="LabelName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Label name
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" onChange={(e)=>setLabelName(e.target.value)} name="Label name" id="Label name" autocomplete="Label name" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" Label name" />
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="Label Color"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Label Color
                            </label>
                            <select id="Label Color" onChange={(e)=>setLabelColor(e.target.value)} name="Label Color" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="Red">Red</option>
                                <option value="Purple">Purple</option>
                                <option value="Yellow">Yellow</option>
                                <option value="Blue">Blue</option>
                                <option value="Orange">Orange</option>
                                <option value="Green">Green</option>
                            </select>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="button" onClick={createLabel} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    create
                    </button>
                </div>
                </div>
            </div>
            </div> 

            <div class={addLocModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Add Location</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="Longitude"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Longitude
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" onChange={(e)=>setLongitude(e.target.value)} name="Longitude" id="Longitude" autocomplete="Longitude" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" Longitude" />
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="Latitude"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Latitude
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" onChange={(e)=>setLatitude(e.target.value)} name="Latitude" id="Latitude" autocomplete="Latitude" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" Latitude" />
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="button" onClick={()=>setAddLocModal('hidden')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    save
                    </button>
                </div>
                </div>
            </div>
            </div> 
            <div class={viewFileModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Uploaded File</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        {attachmentList.map((a, idx)=>(
                            <div>

                            <h1>Document {idx+1}</h1>
                            <p>{a}</p>
                            </div>
                        ))}
                    </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={()=>setViewFilesModal('hidden')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    Done
                    </button>
                </div>
                </div>
            </div>
            </div> 

            <div class={viewChecklistModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Checklist</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div>
                        
                            {currChecklist.map((checklist)=>{
                                let prog=0
                                let progress=20
                                const updateProg = (e)=>{
                                    console.log(e)
                                    if(e==true){
                                        prog++;
                                        console.log();
                                        progress = prog/checklist.data().itemvalue.length*100
                                        console.log(progress);
                                    }
                                }
                                for(var i=0; i<checklist.data().itemvalue.length; i++){
                                    if(checklist.data().itemvalue[i]==true){
                                        prog++;
                                    }
                                }
                                // progress = prog/checklist.data().itemvalue.length*100
                                return(
                                    (
                                        <div>
                                        <p>{checklist.data().checklistName}</p>
                                            {checklist.data().checklistItem.map((item, idx)=>(
                                                <div className="flex">
                                                <input type="checkbox" onChange={(e)=>updateProg(e.target.checked)}value={checklist.data().itemvalue[idx]}/>
                                                <p>{item}</p>
                                            </div> 
                                            ))}
                                        <Progress_bar bgcolor="#7234ff" progress={progress} height={30} />
                                        </div>
                                    )
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={()=>setViewChecklistModal('hidden')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    Done
                    </button>
                </div>
                </div>
            </div>
            </div> 
            
            {/* add Checklist */}
            <div class={createChecklistModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Add Checklist</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="LabelName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Checklist Name
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" onChange={(e)=>setChecklistName(e.target.value)} name="lableName" id="lableName " autocomplete="lableName" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" Checklist Name" />
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="labelColor"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                CheckList Item
                            </label>
                            <div>
                                {checkListItem.map((item)=>(
                                    <span><p>{item}</p></span>
                                ))}
                                <input type="text" value={tempItem} onChange={(e)=>setTempItem(e.target.value)} name="ChecklistItem" id="ChecklistItem" autocomplete="ChecklistItem" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder="Checklist item" />
                                <button type="button" onClick={addItem} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                                    add item
                                </button>
                            </div>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={createChecklist} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    Create Checklist
                    </button>
                </div>
                </div>
            </div>
            </div> 
            <div class={creatingModal2} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Create New Card</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="CardName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Name
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" onChange={(e)=>setCardName(e.target.value)} name="CardName" id="CardName" autocomplete="CardName" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" Card Name" />
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="workspacDescription"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Description
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" onChange={(e)=>setCardDescription(e.target.value)} name="CardDescription" id="CardDescription" autocomplete="CardDescription" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" Card Description" />
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="List"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                List
                            </label>
                            <div>
                            <select id="List" onChange={(e)=>setSelectedList(e.target.value)} name="NotificationFrequency" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="none">none</option>
                                {listOfList.map((list) => (
                                    <option value={list.id}>{list.data().title}</option>
                                ))}
                            </select>
                            </div>
                    </div>
                    </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={createCard} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    create
                    </button>
                </div>
                </div>
            </div>
            </div> 
            <div className="">
            <div className="flex min-h-screen">
                <div className="hidden md:flex md:flex-shrink-0 ">
                <div className="flex flex-col w-64 ">
                <div className="flex flex-col h-0 flex-1">
                    <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1 sticky top-0">
                        <a className="bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        List Gallery
                        </a>
                        <a onClick={()=>navigate(`/seeBoardMember/${workspaceID}/${boardID}`)} className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        See Board Member
                        </a>
                        <a onClick={()=>navigate(`/inviteToBoard/${workspaceID}/${boardID}`)}className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Invite To Board
                        </a>
                        <a onClick={()=>navigate(`/notif`)}className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Notification
                        </a>
                        <a onClick={()=>navigate(`/calendar/${workspaceID}/${boardID}`)}className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        View Calendar
                        </a>
                    </nav>
                </div>
                </div>
                </div>
                <div>
                </div>
                <div>
                    <div>
                    <button type="button" onClick={()=>setCreatingModal("fixed z-10 inset-0 overflow-y-auto")}class={buttonClass}>
                        create new List
                    </button>
                    <button type="button" onClick={()=>setCreatingModal2("fixed z-10 inset-0 overflow-y-auto")}class={buttonClass}>
                        create new Card
                    </button>
                    </div>
                    <DisplayList listOfList={listOfList} setEditCardModal={setEditCardModal} setSelectedList={setSelectedList} setEditCard={setEditCard}/>
                </div>
            </div> 
            </div>
        </div>
    )
}