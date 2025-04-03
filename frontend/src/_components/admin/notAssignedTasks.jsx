import useAdmin from "@/store/admin"
import useAgent from "@/store/agents"
import useTasks from "@/store/task"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useState } from "react"
import PhoneInput from "react-phone-input-2"

export default function NotAssignedTasks({tasks}) {
    const agents = useAgent((state)=>state.agents)
    const addAgentTask = useAgent((state) => state.addAgentTask)
    const removeAdminTask = useAdmin((state) => state.removeAdminTask)
    const { updateTask, removeTask} = useTasks((state) => state)

    const [name, setName] = useState()
    const [phone, setPhone] = useState()
    const [notes, setNotes] = useState()
    const [option, setOption] = useState()
    const [id,setId] = useState()
    const [pop,setPop] = useState(false)
    const [edit,setEdit] = useState(false)

    const handlePop = (Task)=>{
      setName(Task.Name)
      setPhone(Task.Phone)
      setNotes(Task.Notes)
      setOption(Task.Status)
      setId(Task._id)
      setPop(true)
    }
    const handleSave = async()=>{
      try{
        const data = {_id:id, Name: name, Phone: phone, Notes: notes}
        const res = await axios.post('http://localhost:3000/CRUD_Task',{task:data,
        type: option === 'Not assigned' ? 'update' : 'update and assign',
        assignTo: option})

        if(res.status === 200){
          if(option === 'Not assigned'){
            updateTask(res.data.task)
          }
          else{
            updateTask(res.data.task)
            addAgentTask(option,id)
            removeAdminTask(id)
          }
          setPop(false)
          setEdit(false)
        }
      }
      catch(err){alert(err)}
    }
    const handleDelete = async()=>{
      try{
        const res = await axios.post('http://localhost:3000/CRUD_Task',{type:'delete',id})
        if(res.status === 200){
          removeAdminTask(id)
          removeTask(id)
          setPop(false)
          setEdit(false)
        }
      }
      catch(err){alert(err)}
    }
  return (
    <div>
      <div className="min-h-5  mt-5 gap-3 flex flex-wrap items-center justify-center">
        {tasks?.map((task)=>
        <button key={task._id} onClick={()=>handlePop(task)} className="w-[250px] shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_3px_white] p-0.5 rounded-full font-bold">{task.Name}</button>)}
      </div>

      {pop &&<div className="w-full h-full absolute top-0 left-0 bg-black/90 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 dark:bg-black dark:text-white bg-white text-black p-5 rounded-sm">
          <div className="flex w-full items-center justify-center">
            <button onClick={()=>setEdit(!edit)} className="font-bold w-1/2">Edit</button>
            <button className="flex items-center justify-center gap-3 font-bold text-red-700 w-1/2" onClick={handleDelete}>Delete <FontAwesomeIcon icon={faTrash} /></button>
          </div>
          <div className="flex items-center justify-center gap-2">
            <p>Name</p>
            <input value={name} onChange={(e)=>setName(e.target.value)} className="shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_3px_white] p-2 rounded-sm" disabled={!edit}/>
          </div>
          <div className="flex items-center justify-between w-full gap-2">
            <p>Phone</p>
            <PhoneInput country={"in"} value={phone} onChange={(phone) => setPhone(phone)} disabled={!edit}
              containerClass="w-full sm:w-[280px] w-[240px] flex items-center "
              inputClass="!w-full !p-3 !shadow-[0px_0px_5px_black] dark:!shadow-[0px_0px_5px_white] !rounded-sm !bg-white dark:!bg-black !text-black dark:!text-white !border-none !outline-none text-center"
              buttonClass=" dark:!bg-black !border-r dark:!border-gray-700 "
              dropdownClass="dark:!bg-black dark:!text-white dark:hover:!bg-black" />

          </div>
          <div className="flex items-center justify-center gap-2">
            <p>Notes</p>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_3px_white] p-2 rounded-sm" disabled={!edit} />
          </div>
          <div className="flex gap-1 items-center justify-between w-full ">
          <p>Assigned to</p>
            <select onChange={(e) => setOption(e.target.value)} value={option} className="p-1 shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_3px_white] rounded-sm px-5 dark:bg-black dark:text-white" >
              <option>Not assigned</option>
              {agents.length>0 && agents.map((agent)=><option key={agent._id} value={agent._id}>{agent.Name}</option>)}
          </select>
          </div>
          <div className="w-full">
            <button onClick={()=>setPop(false)} className="w-1/2 text-red-600 font-bold ">Close</button>
            <button className="w-1/2 text-blue-950 font-bold dark:text-blue-300" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>}

    </div>
  )
}


