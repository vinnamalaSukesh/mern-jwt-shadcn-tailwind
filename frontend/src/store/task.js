
import { create } from "zustand";
const useTasks = create((set)=>({
    tasks : [],

    setTasks : (Tasks) => set({tasks:Tasks}),
    addTask : (Task) => set((state) => ({tasks:[...state.tasks,Task]})),
    addTasks: (Tasks) => set((state) => ({ tasks: [...state.tasks, ...Tasks] })),
    removeTask : (TaskId) => set((state) => ({tasks:state.tasks.filter((task) => task._id !== TaskId)})),
    updateTask : (Task) =>
        set((state)=>({tasks:state.tasks.map((task) => task._id === Task._id ? Task : task)}))
}))
export default useTasks