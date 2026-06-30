import React, { useState } from 'react'
import "./Profile.css"
import profileImg from "/profile.png"
import { useNavigate } from 'react-router-dom'
import Logout from './Logout'

import MyProfileImg from '/3d-realistic-person-people-vector-illustration.png'
import AboutUsImg from '/3d-vector-warning-danger-risk-message-alert-problem-icon.png'
import logoutImg from '/3d-align-left-isolated-icon-illustration-render.png'
import FaqImg from '/FAQ_Adugalam_Sports turf near me.webp'
import PPImg from '/privacy-document - Adugalam Sports turf near me.webp'

const Profile = () => {

  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout(params) {
    setOpen(true)
  }
  return (
    <div className='profile-container'>

      <p>Profile</p>

      <div className="profile-card">
        <img src={profileImg} alt="" />

        <div className="info">
          <span>Ronald Rechards</span>
          <span>ronaldrechards@gmail.com</span>
        </div>
      </div>


      <div className="option-container">
        <div className="option" onClick={() => navigate('/myprofile')}>
          <section >
            <img src={MyProfileImg} alt="" />
            My Profile
          </section>

          <span> &rarr; </span>
        </div>

        <div className="option" onClick={() => navigate('/faq')}>
          <section>
            <img src={FaqImg} alt="" />
            FAQ
          </section>

          <span> &rarr; </span>
        </div>
        <div className="option" onClick={() => navigate('/privacypolicy')}>
          <section>
            <img src={PPImg} alt="" />
            Privacy Policy
          </section>

          <span> &rarr; </span>
        </div>

        <div className="option" onClick={() => navigate('/aboutus')}>
          <section>
            <img src={AboutUsImg} alt="" />
            About us
          </section>

          <span> &rarr; </span>
        </div>


        <div className="option" onClick={handleLogout}>
          <section >
            <img src={logoutImg} alt="" />
            Logout
          </section>

          <span> &rarr; </span>
        </div>
      </div>

      {open && <Logout setOpen={setOpen} />}
    </div>
  )
}

export default Profile