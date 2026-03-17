import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../firebase"
import bus from "../assets/bus.png"
import { API } from '@/utils/api';

export function Signup(){

const navigate = useNavigate()

const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [confirmPassword,setConfirmPassword] = useState("")

const handleSubmit = async(e:any)=>{

e.preventDefault()

if(password !== confirmPassword){
alert("Passwords do not match")
return
}

try{

const res = await fetch(API.AUTH.REGISTER,{
method:"POST",
headers: API.getHeaders(),
body:JSON.stringify({name,email,password})
})

const data = await res.json()

if(!res.ok){
alert(data.message || "Signup failed")
return
}

localStorage.setItem("token",data.token)
localStorage.setItem("user",JSON.stringify(data.user))

navigate("/home")

}catch(err){
alert("Server error")
}

}

const handleGoogleSignup = async()=>{

try{

const result = await signInWithPopup(auth,googleProvider)
const user = result.user
const idToken = await user.getIdToken()

const res = await fetch(API.AUTH.GOOGLE,{
method:"POST",
headers: API.getHeaders(),
body:JSON.stringify({
idToken,
displayName: user.displayName,
email: user.email,
photoURL: user.photoURL
})
})

const data = await res.json()

localStorage.setItem("token",data.token)
localStorage.setItem("user",JSON.stringify(data.user))

navigate("/home")

}catch(err){
alert("Google signup failed")
}

}

return(

<div className="min-h-screen flex items-center justify-center bg-[#f3e6d6] relative overflow-hidden">

{/* BACKGROUND CIRCLES */}

<div className="absolute w-[700px] h-[700px] bg-orange-300 rounded-full -top-60 -left-60 opacity-50"></div>

<div className="absolute w-[200px] h-[200px] bg-orange-300 rounded-full right-24 top-24 opacity-50"></div>

<div className="absolute w-[150px] h-[150px] bg-orange-300 rounded-full bottom-24 right-72 opacity-50"></div>

{/* BUS IMAGE */} <img
src={bus}
className="absolute left-10 bottom-0 w-[650px] hidden lg:block"
/>

{/* SIGNUP CARD */}

<div className="bg-white shadow-2xl rounded-2xl p-10 w-[420px] relative z-10">

<h1 className="text-3xl font-bold text-center mb-2">
WELCOME
</h1>

<p className="text-center text-gray-500 mb-6">
Let's get you started
</p>

<form onSubmit={handleSubmit} className="space-y-4">

<input
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
className="w-full border rounded-md px-3 py-2"
/>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full border rounded-md px-3 py-2"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full border rounded-md px-3 py-2"
/>

<input
type="password"
placeholder="Confirm Password"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
className="w-full border rounded-md px-3 py-2"
/>

<button
type="button"
onClick={handleGoogleSignup}
className="w-full border rounded-md py-2 hover:bg-gray-100"

>

Continue with Google </button>

<button
className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"

>

Sign Up </button>

</form>

<p className="text-center text-sm mt-4">
Already have an account?{" "}
<Link to="/login" className="text-orange-500 font-medium">
Log in
</Link>
</p>

</div>

</div>
)
}
