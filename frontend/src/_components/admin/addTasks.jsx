import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from "xlsx";
import useAdmin from '@/store/admin';
import axios from 'axios';
import useTasks from '@/store/task';

function AddTasks({ setAddTasks }) {
  const admin = useAdmin((state)=>state.admin._id)
  const {addTasks} = useTasks()
  const {setAdminTasks} = useAdmin()

  const ref = useRef(null)
  const [data,setData] = useState([])

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return;

    const allowedExtensions = ["csv", "xlsx"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      alert("Invalid file type. Please upload a CSV or XLSX file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      const requiredFields = ["Name", "Phone", "Notes", "Status"];
      const isValid = parsedData.every((row) =>
        requiredFields.every((field) => field in row)
      )

      if (!isValid) {
        alert("Invalid file structure. Ensure it contains Name, Phone, Notes, Status.");
        return;
      }

      setData(parsedData);
    };
    reader.readAsBinaryString(file);
  }
  const handleSave = async()=>{
    try{
      const res = await axios.post('http://localhost:3000/CRUD_Task',{admin,tasks:data,type:"insert multiple tasks"})
      if(res.status === 200){
        addTasks(res.data.tasks)
        setAdminTasks(res.data.taskIds)
        setData([])
        setAddTasks(false)
      }
    }
    catch(err){alert(err)}
  }
  return (
      <div className="w-full h-full bg-black/90 top-0 left-0 items-center flex flex-col fixed overflow-auto scrollbar-hidden">
        <input type='file' onChange={(e)=>handleFileUpload(e)} className='hidden' ref={ref}/>
        <div className='shadow-[0px_0px_5px_white] rounded-md items-center justify-center bg-black mt-20'>
          <button onClick={()=>ref.current.click()} className='flex flex-col w-[280px] h-[200px] items-center justify-center gap-5 p-5'>
            <FontAwesomeIcon icon={faArrowUpFromBracket} className='text-white text-3xl'/>
            <p className='text-white'>upload file</p>
          </button>
          <div className='w-full flex'>
            <button onClick={()=>setAddTasks(false)} className='w-1/2 p-2 text-red-400 font-bold'>Cancel</button>
            <button className='w-1/2 p-2 text-blue-300 font-bold' onClick={handleSave}>Save</button>
          </div>
        </div>
        {data.length > 0 &&
        <div className='w-full p-5 bg-black mt-5 z-5'>
          <p className='text-2xl underline text-center text-white'>Preview data</p>
          <div className='flex mt-5 text-xl border-b-2 border-white text-white'>
            <p className='w-1/4 text-center'>Name</p><p className='w-1/4 text-center'>Phone</p><p className='w-1/4 text-center'>Notes</p><p className='w-1/4 text-center'>Status</p>
          </div>
          <div className='h-40vh overflow-auto'>
          {data.map((task,id)=>
          <div key={id} className='flex p-2 text-white'>
              <p className='w-1/4 text-center'>{task.Name}</p><p className='w-1/4 text-center'>{task.Phone}</p><p className='w-1/4 text-center'>{task.Notes}</p><p className='w-1/4 text-center'>{task.Status}</p>
          </div>)}</div>
        </div>
        }
      </div>
  )
}

export default AddTasks
