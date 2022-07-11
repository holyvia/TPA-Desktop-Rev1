
import { async } from "@firebase/util"
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { db } from "../firebase"
import { UseAuth } from "./AuthContext"
import DisplayBoard from "./DisplayBoard"
import DisplayWorkspace from "./DisplayWorkspace"
import Navbar from "./Navbar"
import axios from "axios"

export default function  InviteToWorkspace(){
    const {user} = UseAuth()
    const {workspaceID} = useParams()
    const [inviteEmail, setInviteEmail] = useState('')
    const [generatedLink, setGeneratedLink] = useState('')
    const [sendLink, setSendLink] = useState('')
    const [listInvited ,setListInvited] = useState([])
    const [memberList, setMemberList] = useState([])
    const [emailList, setEmailList] = useState([])
    const navigate = useNavigate()

    const generateLink = () =>{
        
        console.log(new Date())
        const coll = collection(db, "invitations")
        const docRef = addDoc(coll, {
            type:"workspace",
            link:workspaceID,
            approve:"",
            date: new Date()
        }). then((e)=>{
            setGeneratedLink("/signIn/"+e.id)
        })
    }

    const generateLink3 = async()=>{
        if(emailList.includes(inviteEmail) ||listInvited.includes(inviteEmail)){
            alert("email has been invited or is registerd as member")
        }
        else{
            const coll = collection(db, "invitations")
            const docRef = await addDoc(coll, {
                type:"workspace",
                link:workspaceID,
                approve:"",
                date: new Date()
            }). then( async (e)=>{
                setSendLink(`You are invited to a workspace with this link: \nhttp://localhost:3000/signIn/`+e.id)
                alert("invitation sent")
                const ref = doc(db,"workspaces",workspaceID);
                await updateDoc(ref,{
                    listInvited:arrayUnion(inviteEmail)
                })
            })
        }
    }

    const generateLink2 = async()=>{
        let tempEmail = []
        for(var i =0; i <memberList.length; i++){
            const wsRef = doc(db, "users", memberList[i])
            const exec = await getDoc(wsRef) 
            tempEmail.push(exec.data().email)
        }
        setEmailList(tempEmail)
    }

    const generateLink1 = async() =>{
        const wsRef = doc(db, "workspaces", workspaceID)
        const exec = await getDoc(wsRef)
        setListInvited(exec.data().listInvited)
        setMemberList(exec.data().workspaceMember)
        // if(listInvited.includes(inviteEmail) ||  )
        // console.log(new Date())
        // 
    }

    const emailInvite = async() =>{
        console.log(sendLink)
            try{
                await axios({
                    method:'POST',
                    url:"http://localhost:3001/sendinvitation",
                    data:{
                        link:sendLink,
                        to:inviteEmail,
                    },
                }
                      
                )
            }catch(error){
                alert(error)
            }
        }

    useEffect(()=>{
        if(emailList.length!=0){
            generateLink3()
        }
    },[emailList])

    useEffect(()=>{
        if(memberList.length!=0){
            generateLink2()
        }
    }, [memberList])

    useEffect(()=>{
        if(sendLink!=''){
            emailInvite()
        }
    },[sendLink])

    return(
        <div>
            <Navbar/>
            <div className="">
            <div className="flex min-h-screen">
                <div className="hidden md:flex md:flex-shrink-0 ">
                <div className="flex flex-col w-64 ">
                <div className="flex flex-col h-0 flex-1">
                    <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1 sticky top-0">
                        <a onClick={()=>navigate(`/boardGallery/${workspaceID}`)} className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        Board Gallery
                        </a>
                        <a onClick={()=>navigate(`/seeWorkspaceMember/${workspaceID}`)}className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        See Workspace Member
                        </a>
                        <a className="bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
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
                <div>
                <h1>Invite by Link</h1>
                <p>{generatedLink}</p>
                <button type="button" onClick={generateLink} class="inline-flex items-center px-4 py-2 ml-4 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    generate Link
                </button>
                </div>
                <div className="pt-4">
                <h1>Invite by Email</h1>
                <input id="inviteEmail" onChange={(e)=>setInviteEmail(e.target.value)}name="inviteEmail" type="inviteEmail" autocomplete="inviteEmail" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Invited Email"/>
                <button type="button" onClick={generateLink1} class="inline-flex items-center px-4 py-2 ml-4 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    invite by Email
                </button>
                </div>
                </div>
            </div> 
            </div>
        </div>
    )
}