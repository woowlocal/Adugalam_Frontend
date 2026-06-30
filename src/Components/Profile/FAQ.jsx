import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './FAQ.css'

import { IoChevronDown } from "react-icons/io5";
import { FaChevronLeft } from 'react-icons/fa';
const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };


   const navigate = useNavigate()
    function goBack(params) {
    navigate('/profile')}


  const faqs = [
    { question: "What is called playground?", answer: "A playground is an outdoor area for kids to play." },
    { question: "What is a playing ground?", answer: "It is an open area where children engage in sports or activities." },
    { question: "What is playground in school?", answer: "A designated open field where school kids play during breaks." },
    { question: "What type of play is playground?", answer: "It includes physical, social, and creative play." },
    { question: "What is playground for kids?", answer: "A safe environment for kids to have fun, learn, and develop skills." },
    { question: "Why do kids play in playgrounds?", answer: "It improves physical strength, social skills, and creativity." },
  ];
  return (
  <div className='about-container'>
     <p><FaChevronLeft onClick={goBack} className='back-icon'/> FAQ</p> 
     
      <div className="faq-container">
      {faqs.map((item, index) => (
        <div key={index} className="faq-item">
          <button className="faq-question" onClick={() => toggleFAQ(index)}>
            <span>{item.question}</span>
            <IoChevronDown
              className={`arrow-icon ${openIndex === index ? "rotate" : ""}`}
            />
          </button>

          <div className={`faq-answer ${openIndex === index ? "open" : ""}`}>
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
     
     
     
      </div>
  )
}

export default FAQ