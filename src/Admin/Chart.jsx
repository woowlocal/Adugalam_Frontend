function Chart() {
  const days = [
    { day: "Mon", value: 40 },
    { day: "Tue", value: 60 },
    { day: "Wed", value: 80 },
    { day: "Thu", value: 110 },
    { day: "Fri", value: 150 },
    { day: "Sat", value: 200 },
    { day: "Sun", value: 180 }
  ];

  return (
    <div className="chart-box">
      <h2>Booking & Revenue Comparison</h2>

      <div className="bars">
        {days.map((d, i) => (
          <div key={i} className="bar-group">
            <div className="bar" style={{ height: d.value }}></div>
            <span>{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chart;
