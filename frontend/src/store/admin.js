import { create } from "zustand";

const useAdmin = create((set) => ({
    admin : {_id:'',Name : '',email : ''},
    tasks :[],
    setAdmin : (Admin) => set((state)=>({admin : {...state.admin,...Admin}})),

    setAdminTasks : (Tasks) => set({tasks:Tasks}),
    addAdminTask : (Task) => set((state)=>({tasks:[...state.tasks,Task]})),
    addAdminTasks : (Tasks) => set((state)=>({tasks:[...state.tasks,...Tasks]})),
    removeAdminTask : (taskId) => set((state)=>({tasks:[...state.tasks.filter((task)=> taskId !== task)]}))
}))
export default useAdmin