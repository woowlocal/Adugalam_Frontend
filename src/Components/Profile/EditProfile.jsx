import React, { useState } from 'react'
import { FaChevronLeft } from "react-icons/fa";
import "./Profile.css"
import profileImg from "/profile.png"
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {


    const [data , setData ] = useState({
        firstname : "Ronald",
        lastname : "Richards",
        email : "ronaldrichards.com"
    })

    function handleChange(e) {
        const {name , value} = e.target
        setData({
            ...data,
            [name] : value
        })
    }

    const navigate = useNavigate()

function goBack(params) {
    navigate('/profile')
}
    
  return (
    <div className='edit-profile'>

<p><FaChevronLeft onClick={goBack} className='back-icon'/> EditProfile</p>        

<div className="top">
    <div className="profile-card">
    <img src={profileImg} alt="" />

    <div className="info">
        <span>Ronald Rechards</span>
        <span>ronaldrechards@gmail.com</span>
    </div>
</div>

<div className="input-feilds">
    <input type="text" name="firstname" id="" value={data.firstname}  onChange={handleChange}/>
    <input type="text" name="lastname" id="" value={data.lastname} onChange={handleChange}/>
    <input type="text" name="email" id=""  value={data.email} onChange={handleChange}/>
</div>
</div>
        
        <button onClick={goBack}>Save</button>
        
        </div>
  )
}

export default EditProfile