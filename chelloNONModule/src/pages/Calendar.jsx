import { Calendar, globalizeLocalizer } from 'react-big-calendar'
import globalize from 'globalize'
import "react-big-calendar/lib/css/react-big-calendar.css"
import Navbar from './Navbar'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UseAuth } from './AuthContext'
import { addDoc, collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../firebase'
import { onLog } from 'firebase/app'

const localizer = globalizeLocalizer(globalize)

export default function MyCalendar() {
    const {user} = UseAuth()
    const {workspaceID, boardID, listID, cardID} = useParams()
    const navigate = useNavigate()
    const [creatingModal, setCreatingModal] = useState('hidden')
    const [lists, setLists] = useState([])
    const [cardName, setCardName] = useState('')
    const [cardDescription, setCardDescription] = useState('')
    const [selectedList, setSelectedList] = useState('')
    const [dueDate, setDueDate] = useState()

    const [cards, setCards] = useState([])
    useEffect(() => {
        const q = query(collection(db, "workspaces", workspaceID, "boards", boardID, "lists"))
        onSnapshot(q, (docs) => {
            let arr = []
            docs.forEach(doc => {
                arr.push(doc)
            })
            setLists(arr)
        })
    }, [boardID])

    useEffect(()=>{
        if(lists.length!=undefined){
            for(var i = 0; i<lists.length; i++){
                const q = query(collection(db, "workspaces", workspaceID, "boards", boardID, "lists", lists[i].id, "cards"))
                onSnapshot(q, (docs) => {
                    console.log(docs);
                    let arr = []
                    docs.forEach(doc => {
                        if((doc.data().dueDate!= undefined))
                        arr.push({ title: doc.data().cardName, 
                            dueDate: doc.data().dueDate, 
                            id: doc.id })
                    })
                    setCards(arr)
                })
            }
        }
    },[lists])

    const createCard = async ()=>{
        await addDoc(collection(db,"workspaces",workspaceID, "boards", boardID, "lists", selectedList, "cards"), {
            cardName: cardName,
            cardDescription: cardDescription,
            cardWatcher:[user.uid],
            dueDate:dueDate
          });
        setCreatingModal('hidden')
    }
    // console.log(lists[0].id);
    return(
          <div>
              <Navbar/>
              <div class={creatingModal} aria-labelledby="modal-title" role="dialog" aria-modal="true">
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
                            <label for="workspacDescription"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Card Due Date
                            </label>
                            <div class="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="date" name="dueDate" id="dueDate" onChange={(e)=>setDueDate(e.target.value)}/>
                            </div>
                        </div>
                        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label for="List"  class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                List
                            </label>
                            <div>
                            <select id="List" onChange={(e)=>setSelectedList(e.target.value)} name="NotificationFrequency" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="none">none</option>
                                {lists.map((list) => (
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
                          <a onClick={()=>navigate(`cardGallery/${workspaceID}/${boardID}`)}className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
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
                          <a className="bg-gray-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                            View Calendar
                        </a>
                      </nav>
                  </div>
                  </div>
                  </div>
                  <div>
                  </div>
                      <div>
                      <button type="button" onClick={()=>setCreatingModal("fixed z-10 inset-0 overflow-y-auto")}class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          create new Card
                      </button>
                      </div>
                        <Calendar
                            localizer={localizer}
                            events={cards}
                            startAccessor="dueDate"
                            endAccessor="dueDate"
                            style={{ height: 500 }}
                        />
                  </div>
              
              </div>
          </div>
      )
}

