import React, { useEffect, useState } from "react";
import "./DiscountPage.css";


const fetchDiscounts = async () => {
  return [
    {
      id: 1,
      turf: "Turf 1",
      start: "01 Sep",
      end: "10 Sep",
      percent: 20,
    },
    {
      id: 2,
      turf: "Turf 2",
      start: "05 Sep",
      end: "15 Sep",
      percent: 15,
    },
  ];
};

const createDiscount = async (data) => {
  console.log("Sending to API:", data);
  return { success: true };
};

const DiscountPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [form, setForm] = useState({
    turf: "",
    percent: "",
    startDate: "",
    endDate: "",
  });


  useEffect(() => {
    const loadDiscounts = async () => {
      const res = await fetchDiscounts();
      setDiscounts(res);
    };
    loadDiscounts();
  }, []);

 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await createDiscount(form);
    alert("Deal Request Sent");
  };

  return (
    <div className="content">
      <h1>Discount Management</h1>

      <div className="card">
       
        <div className="form-grid">
          <div className="form-group">
            <label>Select Turf</label>
            <select name="turf" onChange={handleChange}>
              <option value="">Select Turf</option>
              <option value="Turf 1">Turf 1</option>
              <option value="Turf 2">Turf 2</option>
            </select>
          </div>

          <div className="form-group">
            <label>Discount Percentage (%)</label>
            <input
              type="number"
              name="percent"
              placeholder="Enter discount"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input type="date" name="startDate" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input type="date" name="endDate" onChange={handleChange} />
          </div>
        </div>

        <button className="deal-btn" onClick={handleSubmit}>
          Deal Request
        </button>

        
        <h3 className="section-title">Active Discounts</h3>

        {discounts.map((item) => (
          <div key={item.id} className="discount-item">
            <span>
              {item.turf} ({item.start} - {item.end})
            </span>
            <span className="badge">{item.percent}% OFF</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountPage;
