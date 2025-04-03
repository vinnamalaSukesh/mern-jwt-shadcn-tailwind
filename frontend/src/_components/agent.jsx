
import { useEffect, useMemo, useState } from "react"
import axios from 'axios'
import useLoginAgent from "@/store/Agent"
import { useTheme } from "@/components/ui/theme-provider"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function Agent() {
    const { setAgent, agent } = useLoginAgent((state)=> state)
    const token = localStorage.getItem('token')
    const [userShow,setUserShow] = useState(false)
    const {theme,setTheme} = useTheme()

    const [name,setName] = useState()
    const [phone,setPhone] = useState()
    const [notes,setNotes] = useState()
    const [status,setStatus] = useState()
    const [id,setId] = useState()
    const [pop, setPop] = useState(false)
    const [edit, setEdit] = useState(false)

    const {updateTask} = useLoginAgent()

    const handleSave = async()=>{
        try{
            const res = await axios.post('http://localhost:3000/CRUD_Task',{type:'status update',taskId:id,Status:status,Notes:notes})
            if(res.status === 200){
                updateTask(res.data.task)
                setPop(false)
                setEdit(false)
            }
        }
        catch(err){alert(err)}
    }
    const handlePop = (task)=>{
        setName(task.Name)
        setPhone(task.Phone)
        setNotes(task.Notes)
        setStatus(task.Status)
        setId(task._id)
        setPop(true)
    }
    const categorizedTasks = useMemo(() => {
        return agent.tasks.reduce((acc, task) => {
            acc[task.Status]?.push(task);
            return acc
        }, {
            "Not started": [],
            "In progress": [],
            "Struck in error": [],
            "Completed": []
        });
    }, [agent.tasks])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.post('http://localhost:3000/', { token: token })
                if (res.status === 200) {
                    setAgent(res.data.agent)
                }
            }
            catch (err) { alert(err) }
        }
        fetchUser()
    }, [])

    return (
    <div className="flex flex-col items-center">
        <div className="flex h-[8vh] shadow-[0px_0px_5px_black] dark:shadow-[0px_0px_5px_white] items-center justify-center w-full fixed z-10">
            <p className="GreatVibes text-3xl font-bold text-blue-950 dark:text-blue-100">Taskify</p>
            <button className="text-2xl absolute right-[5vw] w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] rounded-full bg-black dark:bg-white text-white dark:text-black shadow-[0px_0px_5px_black] dark:shadow-[0px_0px_5px_white]" onClick={() => setUserShow(!userShow)}>{agent.Name[0]}</button>
            {userShow &&
                <div className="flex flex-col absolute right-2 top-[9vh] rounded-sm p-2 gap-3 shadow-[0px_0px_5px_black] dark:shadow-[0px_0px_5px_white] items-center justify-center bg-white dark:bg-black z-5">
                    <p>{agent.Name}</p>
                    <p>{agent.email}</p>
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>light/dark</button>
                    <button className="text-red-700 rounded-sm bg-gray-50 border-2 border-red-700 p-1 w-full font-bold">Logout</button>
                </div>}
        </div>

        <p className="text-2xl text-center mt-20">Assigned tasks</p>
            <Accordion type="single" collapsible className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] 2xl:w-[70vw] mt-5">
                <AccordionItem value="Not started" className='m-5'>
                    <AccordionTrigger className='font-bold flex items-center justify-around'><p className="w-120px text-center">Not started</p><p className="w-120px text-center">No of tasks : {categorizedTasks['Not started'].length}</p></AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap m-2 items-center justify-center">{categorizedTasks['Not started'].map((task)=>
                            <button key={task._id} onClick={() => handlePop(task)} className="w-[250px] p-1 rounded-full shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_3px_white] font-bold m-2">{task.Name}</button>)}</div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="In progress" className='m-5'>
                    <AccordionTrigger className='text-yellow-600 dark:text-yellow-300 font-bold flex items-center justify-around'><p className="w-120px text-center">In progress</p><p className="w-120px text-center">No of tasks : {categorizedTasks['In progress'].length}</p></AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap m-2 items-center justify-center">{categorizedTasks['In progress'].map((task) =>
                            <button key={task._id} onClick={() => handlePop(task)} className="w-[250px] p-1 rounded-full shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_3px_white] font-bold m-2">{task.Name}</button>)}</div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="Struck in error" className='m-5'>
                    <AccordionTrigger className='text-red-700 font-bold dark:text-red-500 flex items-center justify-around'><p className="w-120px text-center">Struck in error</p><p className="w-120px text-center">No of tasks : {categorizedTasks['Struck in error'].length}</p></AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap m-2 items-center justify-center">{categorizedTasks['Struck in error'].map((task) =>
                            <button key={task._id} onClick={() => handlePop(task)} className="w-[250px] p-1 rounded-full shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_3px_white] font-bold m-2">{task.Name}</button>)}</div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="Completed" className='m-5'>
                    <AccordionTrigger className='text-green-900 font-bold dark:text-green-500 items-center justify-around'><p className="w-120px text-center">Completed</p><p className="w-120px text-center">No of tasks : {categorizedTasks['Completed'].length}</p></AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap m-2 items-center justify-center">{categorizedTasks['Completed'].map((task) =>
                            <button key={task._id} onClick={() => handlePop(task)} className="w-[250px] p-1 rounded-full shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_3px_white] font-bold m-2">{task.Name}</button>)}</div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {pop && (
                <div className="w-full h-full absolute top-0 left-0 bg-black/90 flex items-center justify-center">
                    <div className="flex flex-col items-center dark:bg-black dark:text-white bg-white text-black p-3 sm:p-5 rounded-sm w-[280px] sm:w-[300px] dark:shadow-[0px_0px_3px_white] shadow-md">
                        <button onClick={() => setEdit(!edit)} className="font-bold w-full">Edit</button>
                        <div className="w-full">
                            <p className="relative left-5 top-2 bg-white dark:bg-black w-min text-blue-950 dark:text-blue-200 font-bold z-2 p-0">Name</p>
                            <input type="text" value={name} disabled className="p-3 shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_3px_white] w-full rounded-sm px-5 opacity-80 dark:opacity-70 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"/>
                        </div>
                        <div className="w-full">
                            <p className="relative left-5 top-2 bg-white dark:bg-black w-min text-blue-950 dark:text-blue-200 font-bold z-2">Phone</p>
                            <input type="text" value={phone} disabled className="p-3 shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_3px_white] w-full rounded-sm px-5 opacity-80 dark:opacity-70 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400" />
                        </div>
                        <div className="w-full">
                            <p className="relative left-5 top-2 bg-white dark:bg-black w-min text-blue-950 dark:text-blue-200 font-bold z-2">Notes</p>
                            <input type="text" value={notes} onClick={(e) => setNotes(e.target.value)} disabled={!edit} className="text-black dark:text-white p-3 shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_3px_white] w-full rounded-sm px-5 disabled:opacity-80 disabled:dark:opacity-70 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:text-gray-700 disabled:dark:text-gray-400"/>
                        </div>
                        <div className="w-full">
                            <p className="relative left-5 top-2 bg-white dark:bg-black w-min text-blue-950 dark:text-blue-200 font-bold z-2">Status</p>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={!edit} className="text-black dark:text-white p-3 shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_3px_white] w-full rounded-sm px-5 disabled:opacity-80 disabled:dark:opacity-70 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:text-gray-700 disabled:dark:text-gray-400">
                                <option value='Not assigned' className="dark:text-white dark:bg-black">Not assigned</option>
                                <option value='In progress' className="dark:text-white dark:bg-black">In progress</option>
                                <option value='Struck in error' className="dark:text-white dark:bg-black">Struck in error</option>
                                <option value='Completed' className="dark:text-white dark:bg-black">Completed</option>
                            </select>
                        </div>
                        <div className="w-full flex justify-between">
                            <button onClick={() => setPop(false)} className="w-1/2 text-red-700 font-bold p-2">Close</button>
                            <button className="w-1/2 text-blue-950 font-bold dark:text-blue-300 p-2" onClick={handleSave}>Save</button>
                        </div>
                    </div>
                </div>
            )}

    </div>
    )
}