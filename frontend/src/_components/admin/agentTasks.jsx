import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import useAdmin from "@/store/admin";
import useAgent from "@/store/agents";
import useTasks from "@/store/task";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useMemo, useState } from "react";

export default function AgentTasks({ tasks,agentId }) {
    const [taskDetails, setTaskDetails] = useState({ Name: "", Phone: "", Notes: "" })
    const [option, setOption] = useState(agentId)
    const [pop, setPop] = useState(false)
    const [edit, setEdit] = useState(false)

    const agents = useAgent((state)=> state.agents)
    const allTasks = useTasks((state)=> state.tasks)
    const agentTasks = allTasks.filter((task) => tasks.includes(task._id))

    const { addAgentTask, removeAgentTask } = useAgent((state)=> state)
    const { updateTask, removeTask} = useTasks((state)=> state)
    const addAdminTask = useAdmin((state) => state.addAdminTask)

    const categorizedTasks = useMemo(() => {
        return agentTasks.reduce((acc, task) => {
            acc[task.Status]?.push(task);
            return acc
        }, {
            "Not started": [],
            "In progress": [],
            "Struck in error": [],
            "Completed": []
        });
    }, [agentTasks])
    const handlePop = (task) => {
        setTaskDetails({ Name: task.Name, Phone: task.Phone, Notes: task.Notes,_id:task._id, Agent:task.Agent ,createdBy:task.createdBy});
        setPop(true);
        setOption(agentId);
    }
    const handleSave = async () => {
        try {let res
            if(option === agentId){
                res = await axios.post('http://localhost:3000/CRUD_Task',
                    {task:taskDetails,type:'update agent task'})
            }
            else{
                res  = await axios.post('http://localhost:3000/CRUD_Task',
                    {task:taskDetails,type:'update agent task and re-assign',option})
            }
            if (res.status === 200) {
                updateTask(res.data.task)
                if(option !== agentId){
                    if(option !== 'Not assigned'){
                        removeAgentTask(agentId,res.data.task._id)
                        addAgentTask(option,res.data.task._id)
                    }
                }
                else{
                    removeAgentTask(agentId, res.data.task._id)
                    addAdminTask(res.data.task._id)
                }
                }
                setPop(false)
                setEdit(false)
        } catch (err) {
            alert(err);
        }
    }
    const handleDelete = async () => {
        try{
            const res = await axios.post('http://localhost:3000/CRUD_Task',{type:'delete',id:taskDetails._id})
            if(res.status === 200){
                removeAgentTask(agentId,taskDetails._id)
                removeTask(taskDetails._id)
                setPop(false)
                setEdit(false)
            }
        }
        catch(err){alert(err)}
    }
    return (
        <>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="Not started">
                    <AccordionTrigger className='font-bold'>Not started</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap m-2 items-center justify-center">{categorizedTasks['Not started'].map((task) =>
                            <button key={task._id} onClick={() => handlePop(task)} className="w-[200px] p-1 rounded-full shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_3px_white] font-bold m-2">{task.Name}</button>)}</div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="In progress">
                    <AccordionTrigger className='text-yellow-600 dark:text-yellow-300 font-bold'>In progress</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap m-2 items-center justify-center">{categorizedTasks['In progress'].map((task) =>
                            <button key={task._id} onClick={() => handlePop(task)} className="w-[200px] p-1 rounded-full shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_3px_white] font-bold m-2">{task.Name}</button>)}</div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="Struck in error">
                    <AccordionTrigger className='text-red-700 font-bold dark:text-red-500'>Struck in error</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap m-2 items-center justify-center">{categorizedTasks['Struck in error'].map((task) =>
                            <button key={task._id} onClick={() => handlePop(task)} className="w-[200px] p-1 rounded-full shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_3px_white] font-bold m-2">{task.Name}</button>)}</div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="Completed">
                    <AccordionTrigger className='text-green-900 font-bold dark:text-green-500'>Completed</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap m-2 items-center justify-center">{categorizedTasks['Completed'].map((task) =>
                            <button key={task._id} onClick={() => handlePop(task)} className="w-[200px] p-1 rounded-full shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_3px_white] font-bold m-2">{task.Name}</button>)}</div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {pop && (
                <div className="w-full h-full fixed top-0 left-0 bg-black/90 flex items-center justify-center ">
                    <div className="flex flex-col items-center gap-4 dark:bg-black dark:text-white bg-white text-black p-5 rounded-sm">
                    <div className="flex items-center justify-center w-full">
                        <button onClick={() => setEdit(!edit)} className="font-bold w-1/2">Edit</button>
                        <button onClick={handleDelete} className="text-red-700 font-bold w-1/2 gap-3 flex items-center justify-center">Delete <FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                        {['Name', 'Phone', 'Notes'].map((field) => (
                            <div key={field} className="flex items-center gap-2">
                                <p>{field.charAt(0).toUpperCase() + field.slice(1)} :</p>
                                <input
                                    value={taskDetails[field]}
                                    onChange={(e) => setTaskDetails({ ...taskDetails, [field]: e.target.value })}
                                    className="shadow dark:shadow-[0px_0px_2px_white] p-2 rounded-sm"
                                    disabled={!edit}
                                />
                            </div>
                        ))}
                        <div className="flex gap-1 items-center justify-between w-full">
                            <p>Assigned to :</p>
                            <select
                                onChange={(e) => setOption(e.target.value)}
                                value={option}
                                className="p-1 shadow rounded-sm px-5 dark:shadow-[0px_0px_2px_white] dark:bg-black dark:text-white">
                                <option value='Not assigned' className="dark:shadow-[0px_0px_2px_white] dark:text-white">Unassign</option>
                                {agents?.map((agent) => (
                                    <option key={agent._id} value={agent._id} className="dark:shadow-[0px_0px_2px_white] dark:text-white">{agent.Name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full flex justify-between">
                            <button onClick={() => setPop(false)} className="w-1/2 text-red-700 font-bold">Close</button>
                            <button className="w-1/2 text-blue-950 font-bold dark:text-blue-300" onClick={handleSave}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
