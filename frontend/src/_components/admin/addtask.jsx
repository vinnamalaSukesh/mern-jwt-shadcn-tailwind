import useAdmin from "@/store/admin"
import useTasks from "@/store/task";
import axios from "axios"
import { useState } from "react"
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"

export default function Addtask({ setAddTask }){
    const addTask = useTasks((state) => state.addTask)
    const admin = useAdmin((state)=>state.admin._id)

    const [name,setName] = useState("")
    const [phone,setPhone] = useState("")
    const [notes,setNotes] = useState("")

    const handleSave = async()=>{
        try{
            const res = await axios.post('http://localhost:3000/CRUD_Task',{admin,name,phone,notes,type:'create'})
            if(res.status === 200){
                setAddTask(false)
                setName("")
                setPhone("")
                setNotes("")
                addTask(res.data.task)
            }
        }
        catch(err){alert(err)}
    }
  return (
      <div className="w-full h-full bg-black/90 fixed top-0 left-0 items-center justify-center flex z-5">
          <div className="flex flex-col items-center justify-center gap-5 bg-white dark:bg-black p-3 rounded-sm sm:p-5">
              <p className="text-2xl">Add task</p>
              <input type="text" placeholder="Enter Name :" value={name}
                  onChange={(e) => setName(e.target.value)} className="p-2 shadow-[0px_0px_5px_black] dark:shadow-[0px_0px_5px_white] rounded-sm w-[250px] sm:w-[280px]" />
              <PhoneInput country={"in"} value={phone} onChange={(phone) => setPhone(phone)}
                      containerClass="w-full sm:w-[280px] w-[250px] flex items-center "
                      inputClass="!w-full !p-3 !shadow-[0px_0px_5px_black] dark:!shadow-[0px_0px_5px_white] !rounded-sm !bg-white dark:!bg-black !text-black dark:!text-white !border-none !outline-none text-center"
                      buttonClass=" dark:!bg-black !border-r dark:!border-gray-700 "
                      dropdownClass="dark:dark-dropdown" />

              <input type="text" placeholder="Enter note :" value={notes}
                  onChange={(e) => setNotes(e.target.value)} className="p-2 shadow-[0px_0px_5px_black] dark:shadow-[0px_0px_5px_white] rounded-sm w-[250px] sm:w-[280px]" />
              <div className="w-full">
                  <button onClick={() => setAddTask(false)} className="w-1/2 font-bold text-red-600 p-1 rounded-sm">Cancel</button>
                  <button onClick={handleSave} className="w-1/2 font-bold dark:text-blue-300 p-1 rounded-sm text-blue-950">Save</button>
              </div>
          </div>
      </div>
  )
}