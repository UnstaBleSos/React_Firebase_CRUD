import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import db from './fireStore'
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { FaEye, FaEyeSlash, FaTrash   } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
function App() {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const collectionREf = collection(db,'passwords')
  const [items,setItems] = useState([])
  const [visibility, setVisibility] = useState({})
  const [isEdit,setIsEdit] = useState(false)
  const [userId,setUserId] = useState()
  const [tempData ,setTempData] = useState({})
  useEffect(()=>{
    const fetchData= async()=>{
      const snapshot = await getDocs(collectionREf)
      if (snapshot) {
       setItems(snapshot.docs.map((doc)=>({...doc.data(),id:doc.id})))
      }
    }
    fetchData()
  },[])
  

  const notify = (info)=>{
      toast(info)
  }


  const deleteNotify = ()=>{
    toast("Data Deleted")
  }
  const saveUser = async()=>{
    const userREf = doc(collection(db,'passwords'))
    if(email&&password){
      await setDoc(userREf,{
        email:email,
        password:password
      })
      setEmail("")
      setPassword("")
      notify("Data is Saved") 
      fetchData()
    }
    else if(id){
      
    }
    notify("Cannot Save Empty data")

  }

  const toggleVisibility = (id)=>{
      setVisibility((prev)=>({
        ...prev,
        [id]:!prev[id]
      }))
  }

  const delData = async (id)=>{
      const userREf = doc(db,'passwords',id)
      await deleteDoc(userREf)
      deleteNotify()
      fetchData()

  }

  const calcStars = (pass)=>{
   return "*".repeat(pass.length)
  }

  const submitChange = async()=>{
    const userRef = doc(db,'passwords',userId)
    const tempData = {
      email,
      password
    }
    await updateDoc(userRef,tempData)
    notify("Update SuccessFull")
    setEmail("")
    setPassword("")
    setIsEdit(false)
    fetchData()
  }


  const editData = async(data) =>{
    setUserId(data.id)
    setEmail(data.email)
    setPassword(data.password)
    setTempData(data)
    setIsEdit((prev)=> !prev)
  }

  const dismissChange = ()=>{
    setIsEdit(false)
    setEmail("")
    setPassword("")
  }

  return (
    <>
      <div className='bg-gray-700 h-screen flex flex-row justify-center items-center gap-20'>
        <div className='flex flex-col justify-center items-center gap-10 bg-gray-900 p-10 rounded-lg'>
        <h1 className='text-white text-lg'>Save Your Password</h1>
          <input type="text"  className='border-2 border-white text-white h-10 rounded w-full p-2' value={email} placeholder='Email'onChange={(e)=>setEmail(e.target.value)}/>
          <input type="text"  className='border-2 border-white text-white h-10 rounded w-full p-2'value={password} placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
          {isEdit?
          (
            <>
              <button className='bg-green-500 p-2 px-4 rounded hover:bg-green-700 hover:text-white' onClick={submitChange} >Update</button>
              <button className='bg-green-500 p-2 px-4 rounded hover:bg-green-700 hover:text-white' onClick={()=>dismissChange()} >Dismiss</button>
            
            </>
          )
          :
          <button className='bg-green-500 p-2 px-4 rounded hover:bg-green-700 hover:text-white' onClick={saveUser} >Save</button>}
          <ToastContainer 
            position='top-center'
          />
        </div>
        <div className='bg-black p-4 rounded-lg text-white  '>
          {
            items.map((doc)=>{
              return (
                <div className='flex '>
                  <div>
                    <p>{doc.email}</p>
                      <div className='flex gap-3 '>
                        <p>{visibility[doc.id]?doc.password:calcStars(doc.password)}</p>
                          {visibility[doc.id]? <FaEye className='mt-1 mx-2 cursor-pointer' onClick={()=> toggleVisibility(doc.id)} />:
                        <FaEyeSlash className='mt-1 mx-2 cursor-pointer'  onClick={()=>toggleVisibility(doc.id)}/>}
                      </div>
                  </div>
                  <div className='m-2 bg-amber-400 hover:bg-amber-500 p-2 rounded-sm' onClick={()=> delData(doc.id)}>
                      <FaTrash className=' text-red-600 text-lg '/>
                  </div>
                  <div className='m-2   bg-blue-400 hover:bg-blue-500 transition rounded-sm p-2' onClick={()=>editData(doc)}>
                      <MdEdit className='text-white text-lg' />
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  )
}
export default App