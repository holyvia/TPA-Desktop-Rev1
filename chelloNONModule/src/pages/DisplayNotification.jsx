export default function DisplayNotification({listOfNotification}){
    return(
        (listOfNotification.map((notif)=>(
            <div className="float-left ml-10 mt-5 rounded shadow-2xl w-full h-30 bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-base leading-6 font-medium text-gray-900">
                    {notif.data().content}
                </h3>
            </div>
        )))
    )
}