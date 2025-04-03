import useAdmin from "@/store/admin"
import useAgent from "@/store/agents";
import axios from "axios"
import { useState } from "react"
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"

function AddAgent({ setAddAgent }) {
    const admin = useAdmin((state)=> state.admin._id)
    const addAgent = useAgent((state) => state.addAgent)

    const [uname,setUname] = useState("")
    const [email,setEmail] = useState("")
    const [phone,setPhone] = useState("")
    const [pwd,setPwd] = useState("")

    const handleSave = async()=>{
        try{
            const res = await axios.post('http://localhost:3000/CRUD_Agent',{admin,uname,email,phone,pwd,type:'create'})
            if(res.status === 200){
                setAddAgent(false)
                setUname("")
                setEmail("")
                setPwd("")
                setPhone("")
                addAgent(res.data.agent)
            }
            else{alert('agent creation failed')}
        }
        catch(err){
            alert(err)
        }
    }
  return (
    <div className="w-full h-full bg-black/90 fixed top-0 left-0 items-center justify-center flex z-5">
        <div className="flex flex-col items-center justify-center bg-white dark:bg-black p-3 sm:p-5 rounded-sm">
            <p className="text-2xl">Add agent</p>
            <div className="w-full">
                <p className="relative left-5 text-blue-950 top-2 bg-white z-3 dark:bg-black w-20 dark:text-blue-200 font-bold">User name</p>
                  <input type="text" placeholder="Enter username :" value={uname} onChange={(e) => setUname(e.target.value)} className="p-3 shadow-[0px_0px_5px_black] dark:shadow-[0px_0px_5px_white] rounded-sm sm:w-[280px] w-[250px] pt-4 pb-2"/>
            </div>
            <div className="w-full">
                <p className="relative left-5 text-blue-950 top-2 bg-white z-3 dark:bg-black w-10 dark:text-blue-200 font-bold">Email</p>
                <input type="text" placeholder="Enter email :" value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 shadow-[0px_0px_5px_black] dark:shadow-[0px_0px_5px_white] rounded-sm sm:w-[280px] w-[250px] pt-4 pb-2"/>
            </div>
            <div className="w-full">
                <p className="relative left-5 text-blue-950 top-2 bg-white z-3 dark:bg-black w-12 dark:text-blue-200 font-bold">Phone</p>
                <PhoneInput country={"in"} value={phone} onChange={(phone) => setPhone(phone)}
                    containerClass="w-full flex items-center"
                    inputClass="!w-full !p-3 !shadow-[0px_0px_5px_black] dark:!shadow-[0px_0px_5px_white] !rounded-sm !bg-white dark:!bg-black !text-black dark:!text-white !border-none !outline-none text-center"
                    buttonClass=" dark:!bg-black !border-r dark:!border-gray-700 "
                    dropdownClass="dark:!bg-black dark:!text-white dark:hover:!bg-black" />
            </div>
            <div className="w-full">
                <p className="relative left-5 text-blue-950 top-2 bg-white z-3 dark:bg-black w-17 dark:text-blue-200 font-bold">Password</p>
                <input type="password" placeholder="Enter password :" value={pwd} onChange={(e) => setPwd(e.target.value)} className="p-3 shadow-[0px_0px_5px_black] dark:shadow-[0px_0px_5px_white] rounded-sm sm:w-[280px] w-[250px] pt-4 pb-2"/>
            </div>
            <div className="w-full mt-5 p-2">
                <button onClick={()=>setAddAgent(false)} className="w-1/2 font-bold text-red-600 p-1 rounded-sm">Cancel</button>
                <button onClick={handleSave} className="w-1/2 font-bold text-blue-950 dark:text-blue-300 p-1 rounded-sm">Save</button>
            </div>
        </div>
    </div>
  )
}

export default AddAgent