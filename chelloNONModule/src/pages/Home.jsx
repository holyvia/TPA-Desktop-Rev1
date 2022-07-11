
import { async } from "@firebase/util"
import { update } from "firebase/database"
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../firebase"
import { UseAuth } from "./AuthContext"
import DisplayBoard from "./DisplayBoard"
import DisplayWorkspace from "./DisplayWorkspace"
import Navbar from "./Navbar"

export default function  Home(){
    const {user} = UseAuth()
    const [userName, setUserName] = useState('')
    const [workspaceName, setWorkspaceName] = useState('')
    const [workspaceDescription, setWorkspaceDescription] = useState('')
    const [workspaceId, setWorkspaceId] = useState('')
    const [newMemmberEmail, setNewMemberEmail] = useState('')
    const [creatingModal, setCreatingModal] = useState('hidden')
    const [addMemberModal, setAddMemberModal] = useState('hidden')
    const [visibility, setVisibility]= useState('')
    const [listOfWorkspace, setListOfWorkspace] = useState([])
    const [newMemberId, setNewMemberId] = useState('')
    const [notifList, setNotifList] = useState([])
    const [workspaceLink,setWorkspaceLink] = useState('')
    const [searchString, setSearchString] = useState('')
    const [leftWorkspace, setleftWorkspace]= useState()
    const [leaveWorkspaceModal, setLeaveWorkspaceModal] = useState('hidden')
    const [newAdminForLeaveClass, setNewAdminForLeaveClass] = useState('hidden')
    const [leftWorkspaceData, setleftWorkspaceData] = useState()
    const [newAdmin, setNewAdmin] = useState('')
    const [memberList, setMemberList] = useState([])
    const [editWorkspace,setEditWorkspace] =useState('')
    const [chooseWorkspaceToEditClass, setChooseWorkspaceToEditClass] = useState('hidden')
    const [editWorkspaceModal, setEditWorkspaceModal] = useState('')
    const [editVisibility, setEditVisibility] = useState('')
    const [editWorkspaceName, setEditWorkspaceName] = useState('')
    const [editWorkspaceDescription, setEditWorkspaceDescription] = useState('')
    const [listOfBoard, setListOfBoard] = useState([])
    const [cardLink, setCardLink] = useState('')
    const [publicBoards, setPublicBoards] = useState([])

    const navigate = useNavigate()
    const createWorkspace = async()=>{
        await addDoc(collection(db, "workspaces"), {
            workspaceName:workspaceName,
            workspaceDescription:workspaceDescription,
            workspaceAdmin:[user.uid],
            workspaceMember:[user.uid],
            visibility:visibility,
            listInvited:[]
          });
        setCreatingModal('hidden')
        setAddMemberModal('fixed z-10 inset-0 overflow-y-auto')
    }
    const addMember = async ()=>{
        console.log(newMemmberEmail)
        const q = query(collection(db, "users"), where("email","==", newMemmberEmail))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach(async(doc)=>{
            setNewMemberId(doc.id)
            console.log(newMemberId)
        })
        const q1 = query(collection(db,"workspaces"),where("workspaceName","==",workspaceName))
        const querySnapshot1 = await getDocs(q1)
        querySnapshot1.forEach(async(doc)=>{
            setWorkspaceId(doc.id)
        })
        setUserName(user.email)
        console.log(workspaceId)
        console.log(newMemberId)
        if(workspaceId!=''){
            querySnapshot.forEach(async(doc)=>{
                setNewMemberId(doc.id)
                await addDoc(collection(db,"users",newMemberId, "notif"),{
                    content:`you are invited to join workspace `+workspaceName,
                    link:workspaceId
                })
            })
        }

    }

    const joinWorkspace = () => {
        var n = workspaceLink.lastIndexOf('/');
        var result = workspaceLink.substring(n + 1);
        console.log(result);
        navigate(`/invitedView/${result}`)
    }

    const getWorkspaces= async()=>{
        const q = query(collection(db, "workspaces"));
        let tempListOfWorkspace = []
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        tempListOfWorkspace.push(doc)
        setListOfWorkspace(tempListOfWorkspace)
        });
    }

    const getUsersBoard = async()=>{
        let idBoardList = []
        let tempBoardList = []
        let str=[]
        const getUser = await getDoc(doc(db, "users", user.uid))
        idBoardList = getUser.data().listOfBoard
        for(var i =0;i<idBoardList.length; i++){
            str = idBoardList[i].split('/')
            const getboard = await getDoc(doc(db, "workspaces", str[0], "boards", str[1]))
            tempBoardList.push({getboard,str})
        }
        setListOfBoard(tempBoardList)
        console.log(tempBoardList.length)
    }

    useEffect(()=>{
        onSnapshot(query(collection(db, "boards")),querySnapshot=>{
            if(querySnapshot.docs.length!=0){
                setPublicBoards(querySnapshot.docs)
            }
            else{
                setPublicBoards([])
            }
            console.log(querySnapshot.docs.length);
        })
    },[])

    const leaveWorkspace = async()=>{
        console.log(leftWorkspace)
        const exec = await getDoc(doc(db, "workspaces", leftWorkspace))
        setleftWorkspaceData(exec)
        let adminLength = exec.data().workspaceAdmin.length
        let memberLength = exec.data().workspaceMember.length
        console.log(adminLength, memberLength);
        if(exec!=null){
            console.log(exec.data().workspaceAdmin.length);
            if(!exec.data().workspaceAdmin.includes(user.uid)){
                const ref = doc(db,"workspaces",exec.id);
                await updateDoc(ref,{
                    workspaceMember:arrayRemove(user.uid)
                })
            }
            else if( adminLength > 1 ){
                const ref = doc(db,"workspaces",exec.id);
                await updateDoc(ref,{
                    workspaceMember:arrayRemove(user.uid)
                })
                await updateDoc(ref,{
                    workspaceAdmin:arrayRemove(user.uid)
                })
            }
            else if(adminLength==1 && memberLength==1){
                if(window.confirm("You are the last member do you want to delete the workspace")){
                    const del = doc(db,"workspaces",exec.id);
                    await deleteDoc(del)
                    console.log("done")
                }
            }
            else if((adminLength==1) && memberLength>1){
                console.log("asd");
                let tempMemberList = []
                
                for(var i=0; i<exec.data().workspaceMember.length; i++){
                    const mem = await getDoc(doc(db, "users", exec.data().workspaceMember[i]))
                    tempMemberList.push(mem)
                    setMemberList(tempMemberList)
                }
                console.log("a");
                setLeaveWorkspaceModal('hidden')
                setNewAdminForLeaveClass('fixed z-10 inset-0 overflow-y-auto')
            }
            setLeaveWorkspaceModal('hidden')
        }
        
    }

    const goToCard  = async()=>{
        let str = cardLink.split('/')
        console.log(cardLink);
        // onSnapshot(query(doc(db, "workspaces", str[2])),querySnapshot=>{
        //     console.log(querySnapshot.data().workspaceMember);
        //     console.log(querySnapshot.data().visibility);
        // })
        navigate(`/cardGallery/${cardLink}`)
    }

    const selectNewAdmin = async ()=>{
        const ref = doc(db,"workspaces",leftWorkspaceData.id)
        console.log(leftWorkspaceData.id)
        console.log(newAdmin)
        await updateDoc(ref,{
            workspaceAdmin:arrayUnion(newAdmin)
        })
        await updateDoc(ref,{
            workspaceMember:arrayRemove(user.uid)
        })
        await updateDoc(ref,{
            workspaceAdmin:arrayRemove(user.uid)
        })
        setNewAdminForLeaveClass('hidden')
    }

    const goToEditModal = async()=>{
        setChooseWorkspaceToEditClass('hidden')
        setEditWorkspaceModal('fixed z-10 inset-0 overflow-y-auto')
        const ws = await getDoc(doc(db, "workspaces", editWorkspace))
        setEditVisibility(ws.data().visibility)
        setEditWorkspaceName(ws.data().workspaceName)
        setEditWorkspaceDescription(ws.data().workspaceDescription)
    }

    const updatingWorkspace = async()=>{
        await updateDoc(doc(db, "workspaces", editWorkspace),{
            workspaceName:editWorkspaceName,
            workspaceDescription:editWorkspaceDescription,
            visibility:editVisibility
        })
        setEditWorkspaceModal('hidden')
    }

    useEffect(()=>{
        getWorkspaces()
        getUsersBoard().then(console.log("test"))
        setEditWorkspaceModal('hidden')
    }, [])

    useEffect(()=>{
        onSnapshot(collection(db,"workspaces"), querySnapshot=>{
            const workspaces = []
            querySnapshot.forEach(wp=>{
                workspaces.push(wp)
            })
            setListOfWorkspace(workspaces)
        })
    },[])
    
    const handleKeyDown = (e) =>{
        if(e.key ==='W'){
            setCreatingModal('fixed z-10 inset-0 overflow-y-auto')

        }
    }



    if(listOfBoard!=undefined){
        
        return(
            <div>
            <Navbar/>
            <div tabIndex={0} onKeyDown={(e)=>handleKeyDown(e)}>

            
            <div class={creatingModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Create New Workspace</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="workspaceName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Workspace Name
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" onChange={(e)=>setWorkspaceName(e.target.value)} name="workspaceName" id="workspaceName" autocomplete="workspaceName" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" workspace Name" />
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="workspacDescription"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Workspace Description
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" onChange={(e)=>setWorkspaceDescription(e.target.value)} name="workspacDescription" id="workspacDescription" autocomplete="workspacDescription" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" workspace Description" />
                            </div>
                        </div>

                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label for="visibility"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Visibility
                        </label>
                        <div>
                        <select id="visbility" onChange={(e)=>setVisibility(e.target.value)} name="visbility" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="Public">Public</option>
                            <option value="Private" selected>Private</option>
                        </select>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={createWorkspace} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    create
                    </button>
                </div>
                </div>
            </div>
            </div> 
            <div class={addMemberModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Add Member</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="workspaceName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                New Member Email
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" onChange={(e)=>setNewMemberEmail(e.target.value)} name="workspaceName" id="workspaceName" autocomplete="workspaceName" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder="new member email" />
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
            </div>

            <div class={leaveWorkspaceModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Leave Workspace</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="workspaceName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Workspace Name
                            </label>
                            <div>
                            <select id="workspaceName" onChange={(e)=>setleftWorkspace(e.target.value)} name="workspaceList" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="none">none</option>
                                {listOfWorkspace.filter((ws)=>ws.data().workspaceMember.includes(user.uid)).map((filtered) => (
                                    <option value={filtered.id}>{filtered.data().workspaceName}</option>
                                ))}
                            </select>
                            </div>
                        </div>
                       
                    </div>
                    </div>
                </div>
                
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={()=>setLeaveWorkspaceModal('hidden')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    Cancel
                    </button>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={leaveWorkspace} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    Leave
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
                                {memberList.filter((member)=>(!leftWorkspaceData.data().workspaceAdmin.includes(member.id))).map((filtered) => (
                                    <option value={filtered.id}>{filtered.data().username}</option>
                                    ))}
                            </select>
                            </div>
                        </div>
                       
                    </div>
                    </div>
                </div>
                
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={selectNewAdmin} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    set as new admin
                    </button>
                </div>
                </div>
            </div>
            </div>

            <div class={chooseWorkspaceToEditClass} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                
                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Choose Workspace</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="workspaceName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Workspace Name
                            </label>
                            <div>
                            <select id="workspaceName" onChange={(e)=>setEditWorkspace(e.target.value)} name="workspaceList" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="none">none</option>
                                {listOfWorkspace.filter((ws)=>ws.data().workspaceMember.includes(user.uid)).map((filtered) => (
                                    <option value={filtered.id}>{filtered.data().workspaceName}</option>
                                    ))}
                            </select>
                            </div>
                        </div>
                       
                    </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={goToEditModal} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    select workspace
                    </button>
                    <button type="submit" onClick={()=>setChooseWorkspaceToEditClass('hidden')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    cancel editing
                    </button>
                </div>
                </div>
            </div>
            </div>

            <div class={editWorkspaceModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="w-full flex items-end justify-center ml-64 pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
            <div class="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>


                <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
                <div>
                    <h1>Edit Workspace</h1>
                    <div class="mt-3 text-center sm:mt-5">
                    <div class="mt-2">
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="workspaceName"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Workspace Name
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" onChange={(e)=>setEditWorkspaceName(e.target.value)} name="workspaceName" id="workspaceName" autocomplete="workspaceName" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" workspace Name" />
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="workspacDescription"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Workspace Description
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" onChange={(e)=>setEditWorkspaceDescription(e.target.value)} name="workspacDescription" id="workspacDescription" autocomplete="workspacDescription" class="bg-slate-300 flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300 outline-black py-2 px-2" placeholder=" workspace Description" />
                            </div>
                        </div>

                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                        <label for="visibility"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Visibility
                        </label>
                        <div>
                        <select id="visbility" onChange={(e)=>setEditVisibility(e.target.value)} name="visbility" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="Public">Public</option>
                            <option value="Private" selected>Private</option>
                        </select>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" onClick={updatingWorkspace} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    update
                    </button>
                    <button type="submit" onClick={()=>setEditWorkspaceModal('hidden')} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                    cancel updating
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
                        Workspace Gallery
                        </a>
                        <a onClick={()=>navigate(`/notif`)} className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Notification
                        </a>
                        <a onClick={()=>navigate(`/favorite`)} className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Favorite Board
                        </a>
                        <a onClick={()=>navigate(`/closed`)} className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Closed Board
                        </a>
                    </nav>
                </div>
                </div>
                </div>
                <div>
                    <div className="flex">
                        <input type="text" placeholder="search" onChange={(e)=>setSearchString(e.target.value)}/>
                        <button type="button" onClick={()=>setCreatingModal("fixed z-10 inset-0 overflow-y-auto")}class="inline-flex items-center px-4 py-2 ml-4 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            create new workspace
                        </button>
                        <button type="button" onClick={()=>setLeaveWorkspaceModal("fixed z-10 inset-0 overflow-y-auto")}class="inline-flex items-center px-4 py-2 ml-4 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            leave workspace
                        </button>
                        <button type="button" onClick={()=>setChooseWorkspaceToEditClass("fixed z-10 inset-0 overflow-y-auto")}class="inline-flex items-center px-4 py-2 ml-4 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            edit workspace
                        </button>
                    </div>
                    <div className="">
                        <input id="WorkspaceLink" onChange={(e)=>setWorkspaceLink(e.target.value)}name="WorkspaceLink" type="WorkspaceLink" autocomplete="WorkspaceLink" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Workspace Link"/>
                        <button type="button" onClick={joinWorkspace}class="inline-flex items-center px-4 py-2 ml-4 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Join
                        </button>  
                        <input id="CardLink" onChange={(e)=>setCardLink(e.target.value)}name="CardLink" type="CardLink" autocomplete="CardLink" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Card Link"/>
                        <button type="button" onClick={goToCard}class="inline-flex items-center px-4 py-2 ml-4 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Go To Card
                        </button>  
                        <div style={{display:"flex"}}>
                        <div>

                        <h3 className="ml-4 mt-4 text-base leading-6 font-medium text-gray-900">Workspace</h3>

                        <DisplayWorkspace listOfWorkspace={listOfWorkspace} subString={searchString}/>
                        </div>
                
                
                        <div>
                        <h3 className="ml-4 pt-4 text-base leading-6 font-medium text-gray-900">Board</h3>
                        {listOfBoard.map((br)=>(
                            
                            <div className="float-left ml-10 mt-5 rounded shadow-2xl w-64 h-40 bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                    <h3 onClick={()=>navigate(`/cardGallery/${br.str[0]}/${br.str[1]}`)}className="text-base leading-6 font-medium text-gray-900">
                                        {br.getboard.data().boardName}  
                                    </h3>
                                    <p className="text-base leading-6 font-small text-gray-900">
                                        {br.getboard.data().visibility}
                                    </p>
                                </div>
                            
                            ))} 
                            
                        </div>
                        <div>

                        <h3 className="ml-4 w-full pt-4 text-base leading-6 font-medium text-gray-900">Public Board</h3>
                        {publicBoards.map((br1)=>(
                            <div className="float-left ml-10 mt-5 rounded shadow-2xl w-64 h-40 bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 onClick={()=>navigate(`/cardGallery/${br1.data().workspaceID}/${br1.data().boardID}`)}className="text-base leading-6 font-medium text-gray-900">
                                {br1.data().boardName}  
                            </h3>
                            <p className="text-base leading-6 font-small text-gray-900">
                                {br1.data().visibility}
                            </p>
                        </div>
                        ))}
                        </div>
                </div>
                                    
                </div>

                </div>
                

            </div> 
            </div>
            </div>
        </div>
    )
}
}