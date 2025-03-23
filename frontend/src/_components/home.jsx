import { useEffect } from "react"
import axios from 'axios'
import useAdmin from "@/store/admin"

function Home() {
  const token = localStorage.getItem('token')
  const setAdmin = useAdmin((state)=>state.setAdmin)
  const admin = useAdmin((state)=>state.admin)
  
  useEffect(()=>{
    const fetchUser = async()=>{
      try{
        const res = await axios.post('http://localhost:3000/',{token : token})
        if(res.status === 200){
          if(res.data.role === 'Admin'){
            const Admin = { uname: res.data.uname, email: res.data.email, agents: res.data.agents, tasks: res.data.tasks }
            setAdmin(Admin)
          }
        }
      }
      catch(err){
        alert(err)
      }
    }
    fetchUser()
  },[])

  return (
    <div>{JSON.stringify(admin)}</div>
  )
}

export default Home