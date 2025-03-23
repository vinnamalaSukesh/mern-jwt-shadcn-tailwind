import { useState } from "react"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useTheme } from "@/components/ui/theme-provider"
import { Moon, Sun } from "lucide-react"

export default function LoginRegister() {
    const [form, setform] = useState('Login')
    const [option, setOption] = useState('Admin')
    const [uname,setUname] = useState("")
    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const [admin, setAdmin] = useState("")
    const {theme,setTheme} = useTheme()
    const navigate = useNavigate()

    const handleSubmit = async () => {
        if (form === "Login") {
            try {
                const res = await axios.post('http://localhost:3000/Login', { admin, email, pwd })
                if (res.status === 200) {
                    localStorage.setItem('token', res.data.token)
                    navigate('/home')
                }
                else {
                    alert('Login details not match')
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        else if (form === "Register") {
            try {
                const res = await axios.post('http://localhost:3000/Register', { uname,email, pwd })
                if (res.status === 200) {
                    window.location.reload()
                }
                else {
                    alert('Registration failed')
                }
            }
            catch (err) {
                console.log(err)
            }
        }
    }
    return (
        <div className="h-[100vh] w-[100vw] flex flex-col items-center justify-between">
            <div className="h-[8vh] shadow-[0px_0px_5px_black] flex items-center justify-center w-full dark:shadow-[0px_0px_5px_white]"><p className="text-3xl GreatVibes font-bold text-blue-950 dark:text-blue-50">Taskify</p>
            <button onClick={()=>setTheme(theme === "dark" ? "light" : "dark")} className="absolute right-[5vw] bg-black dark:bg-white rounded-full w-[35px] h-[35px] dark:shadow-[0px_0px_5px_white]">
            { theme === "dark"?
                <Sun className="text-yellow-500 m-auto"/>
               :<Moon className="text-white m-auto"/>
            }
            </button>
            </div>

            <div className="shadow-[0px_0px_5px_black] p-5 rounded-md flex flex-col gap-5 items-center justify-between dark:shadow-[0px_0px_3px_white] w-[300px]">
                <div className="w-full flex items-center justify-between">
                    <button onClick={() => setform("Login")} className={form === "Register" ? "bg-green-950 text-white  w-1/2 p-2 text-md rounded-sm text-center" : "text-center text-md p-2"}>Login</button>
                    <button onClick={() => setform("Register")} className={form === "Login" ? "bg-green-950 text-white w-1/2 p-2 text-md rounded-sm text-center" : "text-center text-md p-2"}>Register</button>
                </div>
                {form === "Login" ?
                    <select value={option} onChange={(e) => setOption(e.target.value)} className="w-full text-center p-1 dark:text-black dark:bg-gray-400 bg-gray-200 rounded-sm font-bold">
                        <option className="dark:text-black dark:bg-white" value={"Admin"}>Login as admin</option>
                        <option className="dark:text-black dark:bg-white" value={"Agent"}>Login as agent</option>
                    </select> : null
                }
                {option === 'Agent' & form === 'Login' ?
                    <input type="email" value={admin} onChange={(e)=>{setAdmin(e.target.value)}} placeholder="Enter admin email :" className="p-2 rounded-sm shadow-[0px_0px_3px_black] px-8 dark:shadow-[0px_0px_2px_white]" />: null}
                {form !== "Login" &&
                    <input type="text" value={uname} onChange={(e) => setUname(e.target.value)} placeholder="Enter username : " className="shadow-[0px_0px_3px_black] dark:shadow-[0px_0px_2px_white] p-2 rounded-sm px-8" />}
                <input type="email" placeholder="Enter email : " className="p-2 shadow-[0px_0px_3px_black] rounded-sm px-8 dark:shadow-[0px_0px_2px_white]" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Enter password : " className="p-2 rounded-sm  shadow-[0px_0px_3px_black] px-8 dark:shadow-[0px_0px_2px_white]" value={pwd} onChange={(e) => setPwd(e.target.value)} />
                <button className="w-full bg-blue-950 text-white text-md p-2 rounded-sm px-3" onClick={handleSubmit}>{form}</button>
            </div>

            <div className="bg-blue-950 text-white flex items-center justify-center gap-10 text-md h-[7vh] w-full">
                <p>Designed by Sukesh reddy</p>
                <a href="https://drive.google.com/file/d/1immDyMffpnMEX1XN9VQL50TugHlMP0fz/view?usp=drive_link">My resume</a>
            </div>
        </div>
    )
}