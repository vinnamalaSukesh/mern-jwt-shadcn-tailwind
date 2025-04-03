
import { create } from "zustand"

const useLoginAgent = create((set)=>({
    agent : {Name:'',Phone:'',email:'',Admin:'',tasks:[]},
    setAgent : (Agent) => set({agent:Agent}),

    addTask : (Task) => set((state) => ({agent:{...state.agent,tasks:{...state.agent.tasks,Task}}})),

    updateTask : (Task) => set((state)=> ({agent:{...state.agent,
        tasks: state.agent.tasks.map((task)=> task._id === Task._id ? Task : task)}})),

    removeTask : (TaskId) => set((state)=>({agent:{...state.agent,
        tasks: state.agent.tasks.filter((task) => task._id !== TaskId)}})),
}))
export default useLoginAgent