import React from 'react'

const Messagelibrar = () => {

    const Messagelibrar = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Messagelibrar.map((_, idx)=>(
          <div key={idx} className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}>
            <div className="chat-image avatar">
                <div className="size-10 rounded-full ">
                    <div className="skeleton w-full h-full rounded-full"/>  
                 </div>
            </div>

            <div className="chat-header mb-1">
                <div className="skeleton h-4 w-16"/>
            </div>

            <div className="chat-bubble mb-1">
                <div className="h-4 w-[200px]"/>
            </div>

        </div>
        ))} 
    </div>
  )
}

export default Messagelibrar