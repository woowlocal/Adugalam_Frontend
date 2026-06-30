import React from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const PrivacyPolicy = () => {
    const navigate = useNavigate()
    function goBack(params) {
    navigate('/profile')
}
  return (
      <div className='about-container'>
    <p><FaChevronLeft onClick={goBack} className='back-icon'/> Privacy Policy</p>     
    
    <div className="about-contents">
    <section>
            <h2>Types Of Data we Collect</h2>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque eaque, dignissimos rem incidunt accusantium ipsum magni, perspiciatis labore quis maxime id asperiores quo saepe. Mollitia nulla quasi reiciendis aspernatur quo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque eaque, dignissimos rem incidunt accusantium ipsum magni, perspiciatis labore quis maxime id asperiores quo saepe. Mollitia nulla quasi reiciendis aspernatur quo.</p>
    </section>
    <section>
            <h2>use of your personal data</h2>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque eaque, dignissimos rem incidunt accusantium ipsum magni, perspiciatis labore quis maxime id asperiores quo saepe. Mollitia nulla quasi reiciendis aspernatur quo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque eaque, dignissimos rem incidunt accusantium ipsum magni, perspiciatis labore quis maxime id asperiores quo saepe. Mollitia nulla quasi reiciendis aspernatur quo.</p>
    </section>
    <section>
            <h2>Disclosure of your personal data</h2>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque eaque, dignissimos rem incidunt accusantium ipsum magni, perspiciatis labore quis maxime id asperiores quo saepe. Mollitia nulla quasi reiciendis aspernatur quo.Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque eaque, dignissimos rem incidunt accusantium ipsum magni, perspiciatis labore quis maxime id asperiores quo saepe. Mollitia nulla quasi reiciendis aspernatur quo.</p>
    </section>
    </div>
    
    
        </div>
  )
}

export default PrivacyPolicy