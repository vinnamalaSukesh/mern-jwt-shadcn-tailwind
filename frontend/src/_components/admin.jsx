import { useEffect, useState } from "react"
import axios from 'axios'
import io from 'socket.io-client'

import useAdmin from "@/store/admin"
import useAgent from "@/store/agents"
import useTasks from "@/store/task"

import AddAgent from "./admin/addAgent"
import AddTasks from "./admin/addTasks"
import Addtask from "./admin/addtask"
import { useTheme } from "@/components/ui/theme-provider"
import NotAssignedTasks from "./admin/notAssignedTasks"
import AgentTasks from "./admin/agentTasks"
import AgentShow from "./admin/agentShow"

export default function Admin() {
  const admin = useAdmin((state)=> state.admin)

  const setAdmin = useAdmin((state)=> state.setAdmin)
  const setAgents = useAgent((state)=> state.setAgents)
  const agents = useAgent((state)=>state.agents)
  const setTasks = useTasks((state) => state.setTasks)
  const { setAdminTasks } = useAdmin()

  const tasks = useTasks((state)=>state.tasks)
  const unassignedTasks = tasks.filter((task)=> !task.Agent)

  const token = localStorage.getItem('token')

  const [userShow,setUserShow] = useState(false)
  const {theme,setTheme} = useTheme()

  const [addAgent,setAddAgent] = useState(false)
  const [addTasks, setAddTasks] = useState(false)
  const [addTask, setAddTask] = useState(false)

  const [agentShow,setAgentShow] = useState(null)
  useEffect(()=>{
    const fetchUser = async()=>{
      try{
        const res = await axios.post('http://localhost:3000/',{token : token})
        if(res.status === 200){
          if(res.data.role === 'Admin'){
            setAdmin(res.data.admin)
            setAgents(res.data.agents)
            setTasks(res.data.tasks)
          }
        }
      }
      catch(err){
        alert(err)
      }
    }
    fetchUser()
  },[])
  useEffect(()=>{
    if(admin && admin._id){
    const socket = io('http://localhost:3000', { query: { userId: `Admin-${admin._id}` },
      withCredentials: true, transports: ["websocket"] })
    socket.on('message', (message) => {console.log(message)})

    return () => {socket.disconnect()}
}},[admin])
  const assignAllTasks = async()=>{
    try{
      const res = await axios.post('http://localhost:3000/CRUD_Task',{admin : admin._id,type:"assign all tasks"})
      if(res.status === 200){
        setAdminTasks([])
        setAgents(res.data.agents)
        setTasks(res.data.tasks)
      }
      else{ console(res.message) }
    }
    catch(err){alert(err)}
  }
  return (
    <div>
        <div className="flex h-[8vh] shadow-[0px_0px_5px_black] dark:shadow-[0px_0px_5px_white] items-center justify-center fixed z-10 w-full bg-white top-0 left-0 dark:bg-black">
          <p className="GreatVibes text-3xl font-bold text-blue-950 dark:text-blue-100">Taskify</p>
          <button className="text-2xl absolute right-[5vw] w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] rounded-full bg-black dark:bg-white text-white dark:text-black shadow-[0px_0px_5px_black] dark:shadow-[0px_0px_5px_white]" onClick={()=>setUserShow(!userShow)}>{admin.Name[0]}</button>
          {userShow &&
          <div className="flex flex-col absolute right-2 top-[9vh] rounded-sm p-2 gap-3 shadow-[0px_0px_5px_black] dark:shadow-[0px_0px_5px_white] items-center justify-center bg-white dark:bg-black z-5">
            <p>{admin.Name}</p>
            <p>{admin.email}</p>
            <button onClick={()=>setTheme(theme === 'dark'?'light':'dark')}>light/dark</button>
            <button className="text-red-700 rounded-sm bg-gray-50 border-2 border-red-700 p-1 w-full font-bold">Logout</button>
          </div>}
        </div>

        <div className="flex w-full items-center justify-around sm:font-bold  mt-20">
          <button onClick={() => setAddAgent(true)} className="bg-blue-100 text-black p-1 rounded-sm text-xs w-[80px] sm:w-[150px] sm:text-sm">Add agent</button>
          <button onClick={() => setAddTasks(true)} className="bg-blue-100 text-black p-1 rounded-sm text-xs w-1/4 sm:w-[150px] sm:text-sm">Add tasks</button>
          <button onClick={() => setAddTask(true)} className="bg-blue-100 text-black p-1 w-1/4 rounded-sm text-xs sm:w-[150px] sm:text-sm">Add task</button>
        </div>

        {addAgent && <AddAgent setAddAgent={setAddAgent}/>}
        {addTasks && <AddTasks setAddTasks={setAddTasks}/>}
        {addTask && <Addtask setAddTask={setAddTask}/>}

        <div className=" m-auto mt-10 shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_2px_white] p-5 rounded-md items-center justify-center w-[95vw] sm:w-[90vw]">
          <p className=" text-center text-2xl ">Not assigned tasks</p>
          <NotAssignedTasks tasks={unassignedTasks}/>
          {unassignedTasks.length > 0 && <div className="w-full flex items-center justify-center mt-5"><button className="p-2 bg-blue-100 text-black font-bold rounded-sm" onClick={assignAllTasks}>Assign all tasks sequentially</button></div>}
        </div>

        <div className="m-auto mt-10 shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_2px_white] rounded-md items-center justify-center w-[95vw] sm:w-[90vw] mb-5">
          <p className="w-full text-center text-2xl ">Agents</p>
          <div className="min-h-25 flex flex-wrap items-center justify-evenly mt-5 gap-5">
            {agents?.map((agent,id)=>
            <div key={id} className="w-[270px] sm:w-[300px] shadow-[0px_0px_5px_black] dark:shadow-[0px_0px_3px_white] items-center flex flex-col gap-5 p-3 rounded-md mb-5">
              <button className="text-xl p-3 font-bold" onClick={()=>setAgentShow(agent)}>{agent.Name}</button>
              <AgentTasks agentId={agent._id} tasks={agent.tasks}/>
            </div>
            )}
          </div>
        </div>

      {agentShow && <AgentShow agent={agentShow} setAgentShow={setAgentShow}/>}
    </div>
  )
}