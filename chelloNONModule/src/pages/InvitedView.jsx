import { getAuth } from "firebase/auth"
import { arrayUnion, doc, getDoc, query, updateDoc } from "firebase/firestore"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { db } from "../firebase"
import { UseAuth } from "./AuthContext"

export default function InvitedView(){
    const {user} = UseAuth()
    const {docID} = useParams()
    const acceptInvitation = async() =>{
        console.log(docID)
        const q = query(doc(db,"invitations", docID))
        const snap = await getDoc(q)
        console.log(snap.data());
        console.log(snap.data().date.seconds)
        console.log(new Date().getTime())
        if(new Date().getTime()/1000 - snap.data().date.seconds>864000){
            alert("link is expired")
            navigate(`/home/${user.uid}`)
        }
        else{
            console.log("not expired")
            if(snap.data().type=="workspace"){
                const qState = doc(db, "workspaces", snap.data().link )
                const getQuery = await getDoc(qState)
                console.log(user)
                if(!getQuery.data().workspaceMember.includes(user.uid))
                await updateDoc(qState,{
                    workspaceMember:arrayUnion(user.uid)
                })
            }
            else{
                console.log("is board")
                console.log(snap.data().linkB )
                const qState = doc(db, "workspaces", snap.data().linkWS, "boards", snap.data().linkB )
                const getQuery = await getDoc(qState)
                const qState1 = doc(db, "workspaces", snap.data().linkWS)
                const getQuery1 = await getDoc(qState1)
                console.log(user)
                if(!getQuery.data().boardMember.includes(user.uid)){
                    await updateDoc(qState,{
                        boardMember:arrayUnion(user.uid)
                    })
                    await updateDoc(doc(db, "users", user.uid),{
                        listOfBoard:arrayUnion(snap.data().linkWS+'/'+snap.data().linkB)
                    })
                    if(!getQuery1.data().workspaceMember.includes(user.uid)){
                        await updateDoc(qState1,{
                            workspaceMember:arrayUnion(user.uid)
                        })
                    }
                }
                
            }
            navigate(`/home/${user.uid}`)
        }
    }
    const navigate = useNavigate()
    return(
        <div className="">
            Do you want to join?
            <button onClick={acceptInvitation} class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Accept
            </button>
            <button onClick={()=>navigate(`/home/${user.uid}`)} class="group relative w-full flex justify-center mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Reject
            </button>
        </div>
    )
}