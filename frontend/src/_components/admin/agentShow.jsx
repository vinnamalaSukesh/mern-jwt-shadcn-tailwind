import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import PhoneInput from "react-phone-input-2"
import axios from "axios"
import useAgent from "@/store/agents"

function AgentShow({agent,setAgentShow}) {
    const [name,setName] = useState(agent.Name)
    const [phone,setPhone] = useState(agent.Phone)
    const [email,setEmail] = useState(agent.email)
    const [edit,setEdit] = useState(false)
    const { updateAgent, deleteAgent} = useAgent((state) => state)

    const handleSave = async()=>{
        try{
            const Agent = {Id:agent._id,Name:name,Phone:phone,email:email}
            const res = await axios.post('http://localhost:3000/CRUD_Agent',{type:'update',agent:Agent})

            if(res.status === 200){
                updateAgent(res.data.agent)
                setAgentShow(null)
                setEdit(false)
            }
        }
        catch(err){ alert(err) }
    }
    const handleDelete = async()=>{
        try{
        const res = await axios.post('http://localhost:3000/CRUD_Agent',{type:'delete',Id:agent._id})
        if(res.status === 200){
        deleteAgent(agent._id)
        setEdit(false)
        setAgentShow(false)
        }
        }
        catch(err){alert(err)}
    }
  return (
      <div className="w-full h-full bg-black/90 flex items-center justify-center absolute top-0 left-0 z-5">
          <div className="p-3 bg-white flex flex-col items-center justify-center gap-4">
              <div className="flex items-center w-full">
                  <button className="font-bold w-1/2" onClick={() => setEdit(!edit)}>Edit</button>
                  <button className="font-bold w-1/2 flex text-red-700 gap-3 items-center justify-center" onClick={handleDelete}>Delete<FontAwesomeIcon icon={faTrash} /></button>
              </div>
              <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="p-2 shadow-[0px_0px_3px_black] w-[250px]" disabled={!edit}/>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 shadow-[0px_0px_3px_black] w-[250px]" disabled={!edit} />
              <PhoneInput country={"in"} value={phone} onChange={(phone) => setPhone(phone)} disabled={!edit}
                  containerClass="w-full sm:w-[280px] w-[250px] flex items-center "
                  inputClass="!w-full !p-3 !shadow-[0px_0px_5px_black] dark:!shadow-[0px_0px_5px_white] !rounded-sm !bg-white dark:!bg-black !text-black dark:!text-white !border-none !outline-none text-center"
                  buttonClass=" dark:!bg-black !border-r dark:!border-gray-700 "
                  dropdownClass="dark:!bg-black dark:!text-white dark:hover:!bg-black" />

              <div className="flex items-center justify-around"><p>No of tasks : </p><p>{agent.tasks.length}</p></div>
              <div className="w-full">
                <button className="font-bold text-red-700 w-1/2" onClick={()=>setAgentShow(null)}>Close</button>
                <button className="text-blue-950 font-bold w-1/2" onClick={handleSave}>Save</button>
              </div>
          </div>
      </div>
  )
}

export default AgentShow
