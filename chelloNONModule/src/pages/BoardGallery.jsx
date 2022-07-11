
import { async } from "@firebase/util"
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { db } from "../firebase"
import { UseAuth } from "./AuthContext"
import DisplayBoard from "./DisplayBoard"
import DisplayWorkspace from "./DisplayWorkspace"
import FavoriteBoard from "./FavoriteBoard"
import Navbar from "./Navbar"

export default function  BoardGallery(){
    const {user} = UseAuth()
    const {workspaceID} = useParams()
    const [userName, setUserName] = useState('')
    const [boardName, setBoardName] = useState('')
    const [boardDescription, setBoardDescription] = useState('')
    const [creatingModal, setCreatingModal] = useState('hidden')
    const [addMemberModal, setAddMemberModal] = useState('hidden')
    const [visibility, setVisibility]= useState('Board Visibility')
    const [listOfBoard, setListOfBoard] = useState([])
    const [boardLink, setBoardLink] = useState('')
    const [newMemberEmail, setNewMemberEmail] = useState('')
    const [searchString, setSearchString] =useState('')
    const [createButtonClass, setCreateButtonClass] = useState('hidden')
    const [workspace, setWorkspace] = useState()
    const [leaveBoardModal, setLeaveBoardModal] = useState('hidden')
    const [chooseBoardToEditClass,setChooseBoardToEditClass] = useState('hidden')
    const [newAdminForLeaveClass, setNewAdminForLeaveClass] = useState('hidden')
    const [leftBoard, setleftBoard] = useState('')
    const [leftBoardData, setLeftBoardData] = useState()
    const [newAdmin, setNewAdmin] = useState()
    const [memberList, setMemberList] = useState([])
    const [editBoardModal, setEditBoardModal] = useState('')
    const [editBoard, setEditBoard] = useState()
    const [editVisibility, setEditVisibility] = useState('')
    const [editBoardName, setEditBoardName] = useState('')
    const [editBoardDescription, setEditBoardDescription] = useState('')
    const [addFavoriteModal, setAddFavoriteModal] = useState('hidden')
    const [favoriteBoard, setFavoriteBoard] = useState('')

  
    const navigate = useNavigate()
    const createBoard = async()=>{
        await addDoc(collection(db,"workspaces",workspaceID, "boards"), {
            boardName:boardName,
            boardDescription:boardDescription,
            boardAdmin:[user.uid],
            boardMember:[user.uid],
            visibility:visibility,
            listInvited:[]
          }).then(async(e)=>{
            await updateDoc(doc(db, "users", user.uid),{
                listOfBoard:arrayUnion(workspaceID+"/"+e.id)
            })
            if(visibility=="Public"){
                await addDoc(collection(db,"boards"), {
                    workspaceID:workspaceID,
                    boardID:e.id,
                    boardName:boardName,
                    visibility:visibility
                })
            }
        })

        
        setCreatingModal('hidden')
    }
    const addMember = async (e)=>{

    }

    const getBoards= async()=>{
        const q = query(collection(db, "workspaces", workspaceID, "boards"));
        let tempListOfBoard = []
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            tempListOfBoard.push(doc)
        });
        setListOfBoard(tempListOfBoard)
        console.log(tempListOfBoard);
        console.log(listOfBoard)
    }

    const getWorkspace =  async()=>{
        const ref = doc(db, "workspaces", workspaceID)
        const res = await getDoc(ref)
        setWorkspace(res)
        if(res.data().workspaceMember.includes(user.uid)){
            setCreateButtonClass('inline-flex items-center px-4 py-2 ml-4 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500')
        }
    }


    const addAsFavorite = async()=>{
        await setDoc(doc(db, "users", user.uid, "favoriteBoard", favoriteBoard),{
            workspaceID:workspaceID,
            boardID:favoriteBoard
        })
        setAddFavoriteModal('hidden')
    }


    const leaveBoard = async()=>{
        console.log(leftBoard)
        const exec = await getDoc(doc(db, "workspaces", workspaceID, "boards", leftBoard))
        setLeftBoardData(exec)
        let adminLength = exec.data().boardAdmin.length
        let memberLength = exec.data().boardMember.length
        console.log(adminLength, memberLength);
        if(exec!=null){
            console.log(exec.data().boardAdmin.length);
            if(!exec.data().boardAdmin.includes(user.uid)){
                const ref = doc(db,"workspaces",workspaceID,"boards",exec.id);
                await updateDoc(ref,{
                    boardMember:arrayRemove(user.uid)
                })
            }
            else if( adminLength > 1 ){
                const ref = doc(db,"workspaces",workspaceID,"boards",exec.id);
                await updateDoc(ref,{
                    boardMember:arrayRemove(user.uid)
                })
                await updateDoc(ref,{
                    boardAdmin:arrayRemove(user.uid)
                })
            }
            else if(adminLength==1 && memberLength==1){
                if(window.confirm("You are the last member do you want to delete the board")){
                    const del = doc(db,"workspaces", workspaceID,"boards",exec.id);
                    await deleteDoc(del)
                    console.log("done")
                }
                else{
                    if(window.confirm("Or do you want to close the board")){
                        const adding =await addDoc(collection(db, "users", user.uid, "closedBoard"),{
                            workspaceID:workspaceID,
                            boardID:leftBoard
                        })
                        const edit = await updateDoc(doc(db, "workspaces", workspaceID, "boards", leftBoard ),{
                            status:"closed"
                        })
                    }
                }
            }
            else if((adminLength==1) && memberLength>1){
                console.log("asd");
                let tempMemberList = []
                for(var i=0; i<exec.data().boardMember.length; i++){
                    console.log(exec.data().boardMember[i]);
                    const mem = await getDoc(doc(db, "users", exec.data().boardMember[i]))
                    tempMemberList.push(mem)
                    console.log(tempMemberList)
                    setMemberList(tempMemberList)
                }
                console.log("a");
                setLeaveBoardModal('hidden')
                setNewAdminForLeaveClass('fixed z-10 inset-0 overflow-y-auto')
            }
            setLeaveBoardModal('hidden')
        }
        
        

    }

    const goToEditModal = async()=>{
        setChooseBoardToEditClass('hidden')
        setEditBoardModal('fixed z-10 inset-0 overflow-y-auto')
        const br = await getDoc(doc(db, "workspaces", workspaceID, "boards", editBoard))
        setEditVisibility(br.data().visibility)
        setEditBoardName(br.data().boardName)
        setEditBoardDescription(br.data().boardDescription)
    }   

    // const getMember = async()=>{
    //     let tempMemberList = []
    //     for(var i=0; i<exec.data().workspaceMember.length; i++){
    //         console.log(exec.data().workspaceMember[i]);
    //         const mem = await getDoc(doc(db, "users", exec.data().workspaceMember[i]))
    //         tempMemberList.push(mem)
    //         console.log(tempMemberList)
    //         setMemberList(tempMemberList)
    //     }
    // }
    const selectNewAdmin = async ()=>{
        const ref = doc(db,"workspaces",workspaceID, "boards", leftBoardData.id)
        console.log(leftBoardData.id)
        console.log(newAdmin)
        await updateDoc(ref,{
            boardAdmin:arrayUnion(newAdmin)
        })
        await updateDoc(ref,{
            boardMember:arrayRemove(user.uid)
        })
        await updateDoc(ref,{
            boardAdmin:arrayRemove(user.uid)
        })
        setNewAdminForLeaveClass('hidden')
    }

    useEffect(()=>{
        getBoards()
        getWorkspace()
        setEditBoardModal('hidden')
    }, [])

    useEffect(()=>{
        onSnapshot(collection(db,"workspaces", workspaceID, "boards"), querySnapshot=>{
            let Boards = []
            querySnapshot.forEach(br=>{
                Boards.push(br)
                setListOfBoard(Boards)
            })
        })

    })

    const updatingBoard = async()=>{
        await updateDoc(doc(db, "workspaces", workspaceID, "boards", editBoard),{
            boardName:editBoardName,
            boardDescription:editBoardDescription,
            visibility:editVisibility
        })
        setEditBoardModal('hidden')
    }

    const joinBoard = async()=>{
        // var n
        // for(var i = 0; i<boardLink.length; i++){
        //     if(boardLink[i]==='/' && i!==0){
        //         n=i
        //         break
        //     }
        // }
        // var result = boardLink.substring(n + 1);
        // console.log(result);
        var n = boardLink.lastIndexOf('/');
        var result = boardLink.substring(n + 1);
        console.log(result);
        navigate(`/invitedView/${result}`)
    }

    const handleKeyDown = (e) => {
        if(e.key==='H' ){
            navigate(`/home/${user.uid}`)
        }
    }

    const goToSeeMember = async()=>{

    }
   
    
        return(
            <div>
                <Navbar/>
                <div class="relative min-h-screen flex flex-col" tabIndex={0} onKeyDown={(e)=>handleKeyDown(e)}>
                <div class={creatingModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    
                    <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
    
                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    
                    
                    <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                    <div>
                        <h1>Create New Board</h1>
                        <div class="mt-3 text-center sm:mt-5">
                        <div class="mt-2">
                            <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label for="BoardName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Board Name
                                </label>
                                <div class="mt-1 sm:mt-0 sm:col-span-2">
                                    <input type="text" onChange={(e)=>setBoardName(e.target.value)} name="BoardName" id="BoardName" autocomplete="BoardName" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" Board Name" />
                                </div>
                            </div>
                            <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label for="workspacDescription"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Board Description
                                </label>
                                <div class="mt-1 sm:mt-0 sm:col-span-2">
                                    <input type="text" onChange={(e)=>setBoardDescription(e.target.value)} name="workspacDescription" id="workspacDescription" autocomplete="workspacDescription" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" Board Description" />
                                </div>
                            </div>
    
                            <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="visibility"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Visibility
                            </label>
                            <div>
                            <select id="visbility" onChange={(e)=>setVisibility(e.target.value)} name="visbility" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="Public">Public</option>
                                <option value="Workspace Visibility" selected>Workspace Visibility</option>
                                <option value="Board Visibility" selected>Board Visibility</option>
                            </select>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button type="submit" onClick={createBoard} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                        create
                        </button>
                    </div>
                    </div>
                </div>
                </div> 
                {/* <div class={addMemberModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    
                    <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
    
                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    
                    
                    <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                    <div>
                        <h1>Add Member</h1>
                        <div class="mt-3 text-center sm:mt-5">
                        <div class="mt-2">
                            <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label for="BoardName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    New Member Email
                                </label>
                                <div class="mt-1 sm:mt-0 sm:col-span-2">
                                    <input type="text" onChange={(e)=>setNewMemberEmail(e.target.value)} name="BoardName" id="BoardName" autocomplete="BoardName" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder="new member email" />
                                </div>
                            </div>
                           
                        </div>
                        </div>
                    </div>
                    <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button type="submit" onClick={()=>setAddMemberModal('hidden')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                        Done
                        </button>
                    </div>
                    <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button type="submit" onClick={addMember} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                        Add
                        </button>
                    </div>
                    </div>
                </div>
                </div> */}
    
                <div class={leaveBoardModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    
                    <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    
                    <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                    <div>
                        <h1>Leave Board</h1>
                        <div class="mt-3 text-center sm:mt-5">
                        <div class="mt-2">
                            <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label for="boardName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Board Name
                                </label>
                                <div>
                                <select id="boardName" onChange={(e)=>setleftBoard(e.target.value)} name="boardList" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                    <option value="none">none</option>
                                    {listOfBoard.filter((br)=>br.data().boardMember.includes(user.uid) && br.data().status!="closed").map((filtered) => (
                                        <option value={filtered.id}>{filtered.data().boardName}</option>
                                    ))}
                                </select>
                                </div>
                            </div>
                        
                        </div>
                        </div>
                </div>
                
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={()=>setLeaveBoardModal('hidden')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    Cancel
                    </button>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={leaveBoard} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    Leave
                    </button>
                </div>
                </div>
            </div>
            </div>


            <div class={addFavoriteModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    
                    <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    
                    <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                    <div>
                        <h1>Add Favorite Board</h1>
                        <div class="mt-3 text-center sm:mt-5">
                        <div class="mt-2">
                            <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label for="boardName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Board Name
                                </label>
                                <div>
                                <select id="boardName" onChange={(e)=>setFavoriteBoard(e.target.value)} name="boardList" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                    <option value="none">none</option>
                                    {listOfBoard.filter((br)=>br.data().boardMember.includes(user.uid) && br.data().status!="closed").map((filtered) => (
                                        <option value={filtered.id}>{filtered.data().boardName}</option>
                                    ))}
                                </select>
                                </div>
                            </div>
                        
                        </div>
                        </div>
                </div>
                
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={()=>setAddFavoriteModal('hidden')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    Cancel
                    </button>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={addAsFavorite} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    Add as favorite
                    </button>
                </div>
                </div>
            </div>
            </div>


                                        


            <div class={newAdminForLeaveClass} aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    
                    <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    
                    <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                    <div>
                        <h1>Select New Admin</h1>
                        <div class="mt-3 text-center sm:mt-5">
                        <div class="mt-2">
                            <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label for="memberList"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    New Member Email
                                </label>
                                <div>
                                <select id="memberList" onChange={(e)=>setNewAdmin(e.target.value)} name="memberList" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                    <option value="none">none</option>
                                    {memberList.filter((member)=>(!leftBoardData.data().boardAdmin.includes(member.id))).map((filtered) => (
                                        <option value={filtered.id}>{filtered.data().username}</option>
                                    ))}
                                </select>
                                </div>
                            </div>
                        
                        </div>
                        </div>
                    </div>`
                
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={selectNewAdmin} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    set as new admin
                    </button>
                </div>
                </div>
            </div>
            </div>

            <div class={editBoardModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
            <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>


                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Edit Board</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="boardName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Board Name
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" onChange={(e)=>setEditBoardName(e.target.value)} name="boardName" id="boardName" autocomplete="boardName" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder="Board Name" />
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="workspacDescription"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Board Description
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" onChange={(e)=>setEditBoardDescription(e.target.value)} name="boardDescription" id="boardDescription" autocomplete="boardDescription" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder="Board Description" />
                            </div>
                        </div>

                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label for="visibility"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Visibility
                        </label>
                        <div>
                        <select id="visbility" onChange={(e)=>setEditVisibility(e.target.value)} name="visbility" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="Public">Public</option>
                            <option value="Workspace Visibility" selected>Workspace Visibility</option>
                            <option value="Board Visibility" selected>Board Visibility</option>
                        </select>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="button" onClick={()=>updatingBoard()} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    update
                    </button>
                    <button type="submit" onClick={()=>setEditBoardModal('hidden')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    cancel updating
                    </button>
                </div>
                </div>
            </div>
            </div>

            <div class={chooseBoardToEditClass} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Choose Board</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="boardName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Board Name
                            </label>
                            <div>
                            <select id="boardName" onChange={(e)=>setEditBoard(e.target.value)} name="boardList" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="none">none</option>
                                {listOfBoard.filter((ws)=>ws.data().boardMember.includes(user.uid)).map((filtered) => (
                                    <option value={filtered.id}>{filtered.data().boardName}</option>
                                    ))}
                            </select>
                            </div>
                        </div>
                       
                    </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={goToEditModal} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    select board
                    </button>
                    <button type="submit" onClick={()=>setChooseBoardToEditClass('hidden')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    cancel editing
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
                            Board Gallery
                            </a>
                            <a onClick={()=>navigate(`/seeWorkspaceMember/${workspaceID}`)}className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                            See Workspace Member
                            </a>
                            <a onClick={()=>navigate(`/inviteToWorkspace/${workspaceID}`)} className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                            Invite To Workspace
                            </a>
                            <a className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                            Notification
                            </a>
                        </nav>
                    </div>
                    </div>
                    </div>
                    <div>
                    <div className="flex">
                    <input type="text" placeholder="search" onChange={(e)=>setSearchString(e.target.value)}/>
                    <button type="button" className={createButtonClass} onClick={()=>setCreatingModal("fixed z-10 inset-0 overflow-y-auto")}>
                        create new board
                    </button>
                    <button type="button" onClick={()=>setLeaveBoardModal("fixed z-10 inset-0 overflow-y-auto")}class="inline-flex items-center px-4 py-2 ml-4 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        leave board
                    </button>
                    <button type="button" onClick={()=>setChooseBoardToEditClass("fixed z-10 inset-0 overflow-y-auto")}class="inline-flex items-center px-4 py-2 ml-4 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        edit board
                    </button>
                    <button type="button" onClick={()=>setAddFavoriteModal("fixed z-10 inset-0 overflow-y-auto")}class="inline-flex items-center px-4 py-2 ml-4 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        add board as favorite
                    </button>
                    </div>
                    <div className="pt-8">
                        <input id="BoardLink" onChange={(e)=>setBoardLink(e.target.value)}name="BoardLink" type="BoardLink" autocomplete="BoardLink" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Board Link"/>
                        <button type="button" onClick={joinBoard}class="inline-flex items-center px-4 py-2 ml-4 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Join
                        </button>    
                    </div>
                    <div>
                        <DisplayBoard listOfBoard={listOfBoard} searchString={searchString}/>
                    </div>
                    </div>
                </div> 
                </div>
                </div>
            </div>
        )
}