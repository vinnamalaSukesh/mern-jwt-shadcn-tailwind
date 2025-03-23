
import { create } from "zustand";
const useAdmin = create((set) => ({
    admin : {uname: "",email: "",agents: [],tasks: []},
    setAdmin : (Admin) => set({admin:Admin}),

    addAgent : (agent) =>
        set((state)=>({admin:{...state.admin,agents:[...state.admin.agents,agent]}})),

    removeAgent : (agentId) =>
        set((state)=>({admin:{...state.admin,agents:
            [state.admin.agents.filter((agent)=>agentId !== agent._id)]}})),
    
    Addtask : (Task) =>
        set((state)=>({admin:{...state.admin,tasks:[...state.tasks,Task]}})),

    AddTasks : (Tasks) =>
        set((state)=>({admin:{...state.admin,tasks:[...state.admin.tasks,...Tasks]}})),

    removeTask : (TaskId) =>
        set((state)=>({admin:{...state.admin,tasks:[...state.admin.tasks.filter((task)=> task._id !== TaskId)]}}))
}))
export default useAdmin