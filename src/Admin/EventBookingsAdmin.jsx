import React, { useEffect, useState } from "react";
import AdminAPI from "../api/adminApi";

export default function EventBookingsAdmin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    AdminAPI.get("api/admin/event-bookings/")
      .then(res => { setBookings(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      b.attendee_name.toLowerCase().includes(q) ||
      b.attendee_email.toLowerCase().includes(q) ||
      b.event_title.toLowerCase().includes(q) ||
      b.booking_ref.toLowerCase().includes(q) ||
      b.attendee_whatsapp.includes(q);
    const matchType = filterType === "all" || b.ticket_type === filterType;
    return matchSearch && matchType;
  });

  const totalRevenue = filtered.filter(b => !b.is_free).reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);
  const freeCount = filtered.filter(b => b.is_free).length;
  const paidCount = filtered.filter(b => !b.is_free).length;

  if (loading) return <div style={{ padding:"40px",textAlign:"center",color:"#6b7280" }}>Loading bookings...</div>;

  const stats = [
    { label:"Total Bookings", value: filtered.length, color:"#3b82f6", bg:"#eff6ff" },
    { label:"Paid Bookings",  value: paidCount,        color:"#7c3aed", bg:"#f5f3ff" },
    { label:"Free Bookings",  value: freeCount,         color:"#059669", bg:"#f0fdf4" },
    { label:"Total Revenue",  value:`?${totalRevenue.toLocaleString("en-IN",{minimumFractionDigits:2})}`, color:"#d97706", bg:"#fffbeb" },
  ];

  const headers = ["Booking Ref","Event","Attendee","Email","WhatsApp","Ticket","Qty","Amount","Status","Date"];

  return (
    <div style={{ padding:"24px",fontFamily:"'Segoe UI',Arial,sans-serif",background:"#f8fafc",minHeight:"100vh" }}>
      <div style={{ marginBottom:"24px" }}>
        <h1 style={{ margin:0,fontSize:"24px",fontWeight:700,color:"#111827" }}>??? Event Bookings</h1>
        <p style={{ margin:"4px 0 0",color:"#6b7280",fontSize:"14px" }}>All confirmed event ticket bookings</p>
      </div>

      <div style={{ display:"flex",gap:"16px",marginBottom:"24px",flexWrap:"wrap" }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:s.bg,border:`1px solid ${s.color}33`,borderRadius:"12px",padding:"16px 24px",flex:"1 1 150px" }}>
            <div style={{ fontSize:"22px",fontWeight:800,color:s.color }}>{s.value}</div>
            <div style={{ fontSize:"12px",color:"#6b7280",marginTop:"2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex",gap:"12px",marginBottom:"20px",flexWrap:"wrap",alignItems:"center" }}>
        <input
          type="text" placeholder="Search by name, email, event, ref..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex:"1 1 260px",padding:"10px 14px",borderRadius:"8px",border:"1px solid #e5e7eb",fontSize:"14px",outline:"none",background:"#fff" }}
        />
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          style={{ padding:"10px 14px",borderRadius:"8px",border:"1px solid #e5e7eb",fontSize:"14px",background:"#fff",cursor:"pointer" }}>
          <option value="all">All Types</option>
          <option value="normal">Normal</option>
          <option value="vip">VIP</option>
        </select>
        <span style={{ fontSize:"13px",color:"#6b7280" }}>{filtered.length} records</span>
      </div>

      <div style={{ background:"#fff",borderRadius:"14px",overflow:"hidden",boxShadow:"0 1px 8px rgba(0,0,0,0.08)",border:"1px solid #e5e7eb" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:"14px" }}>
            <thead>
              <tr style={{ background:"#f9fafb",borderBottom:"2px solid #e5e7eb" }}>
                {headers.map(h => (
                  <th key={h} style={{ padding:"12px 16px",textAlign:"left",fontWeight:600,color:"#374151",whiteSpace:"nowrap",fontSize:"13px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ padding:"40px",textAlign:"center",color:"#9ca3af" }}>No bookings found</td></tr>
              ) : filtered.map((b, idx) => (
                <tr key={b.id}
                  style={{ borderBottom:"1px solid #f3f4f6",background:idx%2===0?"#fff":"#fafafa",cursor:"default" }}
                  onMouseEnter={e => e.currentTarget.style.background="#f0f9ff"}
                  onMouseLeave={e => e.currentTarget.style.background=idx%2===0?"#fff":"#fafafa"}
                >
                  <td style={{ padding:"12px 16px",whiteSpace:"nowrap" }}>
                    <span style={{ background:"#f0fdf4",color:"#059669",fontWeight:700,fontSize:"12px",padding:"3px 8px",borderRadius:"6px",fontFamily:"monospace",letterSpacing:"1px" }}>
                      {b.booking_ref}
                    </span>
                  </td>
                  <td style={{ padding:"12px 16px",maxWidth:"160px" }}>
                    <div style={{ fontWeight:600,color:"#111827",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{b.event_title}</div>
                  </td>
                  <td style={{ padding:"12px 16px",whiteSpace:"nowrap",color:"#374151",fontWeight:500 }}>{b.attendee_name}</td>
                  <td style={{ padding:"12px 16px",color:"#4b5563",whiteSpace:"nowrap" }}>
                    <a href={`mailto:${b.attendee_email}`} style={{ color:"#3b82f6",textDecoration:"none" }}>{b.attendee_email}</a>
                  </td>
                  <td style={{ padding:"12px 16px",whiteSpace:"nowrap",color:"#374151" }}>{b.attendee_whatsapp}</td>
                  <td style={{ padding:"12px 16px",whiteSpace:"nowrap" }}>
                    <span style={{ padding:"3px 10px",borderRadius:"20px",fontSize:"12px",fontWeight:600,
                      background:b.ticket_type==="vip"?"#f5f3ff":"#f0fdf4",
                      color:b.ticket_type==="vip"?"#7c3aed":"#059669" }}>
                      {b.ticket_type==="vip"?"?? VIP":"?? Normal"}
                    </span>
                  </td>
                  <td style={{ padding:"12px 16px",textAlign:"center",fontWeight:600,color:"#374151" }}>{b.qty}</td>
                  <td style={{ padding:"12px 16px",whiteSpace:"nowrap",fontWeight:700 }}>
                    {b.is_free
                      ? <span style={{ color:"#059669" }}>FREE</span>
                      : <span style={{ color:"#7c3aed" }}>?{parseFloat(b.total_amount).toLocaleString("en-IN",{minimumFractionDigits:2})}</span>
                    }
                  </td>
                  <td style={{ padding:"12px 16px",whiteSpace:"nowrap" }}>
                    <span style={{ padding:"3px 10px",borderRadius:"20px",fontSize:"12px",fontWeight:600,background:"#f0fdf4",color:"#059669" }}>? {b.status}</span>
                  </td>
                  <td style={{ padding:"12px 16px",whiteSpace:"nowrap",color:"#6b7280",fontSize:"12px" }}>{b.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
