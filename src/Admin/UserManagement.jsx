import { useEffect, useState } from "react";
import "./UserManagement.css";

/* ── helpers ── */
const API = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");
const getToken = () => localStorage.getItem("access");

/* ── icon SVGs ── */
const IconSearch  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>;
const IconEdit    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>;
const IconTrash   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IconUsers   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconClose   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconRefresh = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>;

export default function UserManagement() {
  const [users,           setUsers]           = useState([]);
  const [search,          setSearch]          = useState("");
  const [editingUser,     setEditingUser]     = useState(null);
  const [activeTab,       setActiveTab]       = useState("users");
  const [retireRequests,  setRetireRequests]  = useState([]);
  const [retireLoading,   setRetireLoading]   = useState(false);
  const [usersLoading,    setUsersLoading]    = useState(true);
  const [toastMsg,        setToastMsg]        = useState("");
  const [toastType,       setToastType]       = useState("success"); // "success" | "error"

  const [form, setForm] = useState({ name: "", mobile: "", is_active: true });

  /* ── toast helper ── */
  const showToast = (msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(""), 3000);
  };

  /* ── data loaders ── */
  const loadUsers = () => {
    setUsersLoading(true);
    fetch(`${API}/api/users/?search=${search}`)
      .then(r => r.json())
      .then(d => { setUsers(d); setUsersLoading(false); })
      .catch(() => setUsersLoading(false));
  };

  const loadRetireRequests = () => {
    setRetireLoading(true);
    fetch(`${API}/api/admin/retire-requests/`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(d => { setRetireRequests(Array.isArray(d) ? d : []); setRetireLoading(false); })
      .catch(() => setRetireLoading(false));
  };

  useEffect(() => { loadUsers(); }, [search]);
  useEffect(() => { if (activeTab === "retire") loadRetireRequests(); }, [activeTab]);

  /* ── actions ── */
  const openEdit = user => {
    setEditingUser(user);
    setForm({ name: user.name, mobile: user.mobile, is_active: user.is_active });
  };

  const updateUser = async () => {
    await fetch(`${API}/api/users/${editingUser.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setEditingUser(null);
    loadUsers();
    showToast("User updated successfully.");
  };

  const deleteUser = async id => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    await fetch(`${API}/api/users/${id}/delete/`, { method: "DELETE" });
    loadUsers();
    showToast("User deleted.", "error");
  };

  const handleRetireAction = async (userId, action) => {
    const msg = action === "approve"
      ? "Permanently DELETE this user's account?" : "Reject this request and restore account?";
    if (!window.confirm(msg)) return;
    const res  = await fetch(`${API}/api/admin/retire-requests/${userId}/action/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    showToast(data.message || "Done.", action === "approve" ? "error" : "success");
    loadRetireRequests();
  };

  /* ── derived ── */
  const filteredUsers = users.filter(u =>
    (u.name  || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="um-page">

      {/* ── Toast ── */}
      {toastMsg && (
        <div className={`um-toast um-toast--${toastType}`}>
          {toastType === "success" ? "" : "🗑️"} {toastMsg}
        </div>
      )}

      {/* ── Hero Header ── */}
      <div className="um-hero">
        <div className="um-hero-orb um-hero-orb1" aria-hidden />
        <div className="um-hero-orb um-hero-orb2" aria-hidden />
        <div className="um-hero-inner">
          <div className="um-hero-icon"><IconUsers /></div>
          <div>
            <h1 className="um-hero-title">User Management</h1>
            <p  className="um-hero-sub">Manage all registered users · {users.length} total</p>
          </div>
        </div>
        <button className="um-refresh-btn" onClick={activeTab === "users" ? loadUsers : loadRetireRequests}>
          <IconRefresh /> Refresh
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="um-tabs">
        <button
          className={`um-tab ${activeTab === "users" ? "um-tab--active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <IconUsers /> All Users
          <span className="um-tab-count">{users.length}</span>
        </button>
        <button
          className={`um-tab um-tab--danger ${activeTab === "retire" ? "um-tab--active-danger" : ""}`}
          onClick={() => setActiveTab("retire")}
        >
          🗑️ Delete Requests
          {retireRequests.length > 0 && (
            <span className="um-badge">{retireRequests.length}</span>
          )}
        </button>
      </div>

      {/* ════════ TAB: ALL USERS ════════ */}
      {activeTab === "users" && (
        <div className="um-section">

          {/* Search */}
          <div className="um-search-wrap">
            <span className="um-search-icon"><IconSearch /></span>
            <input
              className="um-search"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="um-search-clear" onClick={() => setSearch("")}>
                <IconClose />
              </button>
            )}
          </div>

          {/* Loading skeleton */}
          {usersLoading && (
            <div className="um-skeleton-list">
              {[1,2,3,4,5].map(i => <div key={i} className="um-skeleton-row" />)}
            </div>
          )}

          {/* User cards (mobile) / table (desktop) */}
          {!usersLoading && (
            <>
              {/* ── Desktop table ── */}
              <div className="um-table-wrap">
                <table className="um-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 && (
                      <tr><td colSpan={6} className="um-empty-cell">No users found.</td></tr>
                    )}
                    {filteredUsers.map((user, idx) => (
                      <tr key={user.id} style={{ animationDelay: `${idx * 0.04}s` }}>
                        <td className="um-td-num">{idx + 1}</td>
                        <td className="um-td-name">
                          <div className="um-avatar">{(user.name || "?")[0].toUpperCase()}</div>
                          <span>{user.name}</span>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.mobile || "—"}</td>
                        <td>
                          <span className={`um-status ${user.is_active ? "um-status--active" : "um-status--blocked"}`}>
                            {user.is_active ? "Active" : "Blocked"}
                          </span>
                        </td>
                        <td>
                          <div className="um-actions">
                            <button className="um-btn um-btn--edit"   onClick={() => openEdit(user)}><IconEdit /> Edit</button>
                            <button className="um-btn um-btn--delete" onClick={() => deleteUser(user.id)}><IconTrash /> Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Mobile cards ── */}
              <div className="um-card-list">
                {filteredUsers.length === 0 && (
                  <div className="um-empty-state">
                    <span className="um-empty-icon">👤</span>
                    <p>No users found.</p>
                  </div>
                )}
                {filteredUsers.map((user, idx) => (
                  <div key={user.id} className="um-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="um-card-head">
                      <div className="um-avatar um-avatar--lg">{(user.name || "?")[0].toUpperCase()}</div>
                      <div className="um-card-info">
                        <div className="um-card-name">{user.name}</div>
                        <div className="um-card-email">{user.email}</div>
                      </div>
                      <span className={`um-status ${user.is_active ? "um-status--active" : "um-status--blocked"}`}>
                        {user.is_active ? "Active" : "Blocked"}
                      </span>
                    </div>
                    {user.mobile && <div className="um-card-phone">📱 {user.mobile}</div>}
                    <div className="um-actions um-actions--card">
                      <button className="um-btn um-btn--edit"   onClick={() => openEdit(user)}><IconEdit /> Edit</button>
                      <button className="um-btn um-btn--delete" onClick={() => deleteUser(user.id)}><IconTrash /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ════════ TAB: RETIRE REQUESTS ════════ */}
      {activeTab === "retire" && (
        <div className="um-section">
          <div className="um-section-header">
            <h2 className="um-section-title">🗑️ Account Deletion Requests</h2>
            <span className="um-section-badge">{retireRequests.length} pending</span>
          </div>

          {retireLoading && (
            <div className="um-skeleton-list">
              {[1,2,3].map(i => <div key={i} className="um-skeleton-row" />)}
            </div>
          )}

          {!retireLoading && retireRequests.length === 0 && (
            <div className="um-empty-state">
              <span className="um-empty-icon">📁</span>
              <p>No pending deletion requests.</p>
              <p className="um-empty-sub">All accounts are in good standing.</p>
            </div>
          )}

          {!retireLoading && retireRequests.length > 0 && (
            <>
              {/* Desktop table */}
              <div className="um-table-wrap">
                <table className="um-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Reason</th>
                      <th>Requested At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {retireRequests.map((user, idx) => (
                      <tr key={user.id} style={{ animationDelay: `${idx * 0.04}s` }}>
                        <td className="um-td-name">
                          <div className="um-avatar um-avatar--red">{(user.name || "?")[0].toUpperCase()}</div>
                          <span>{user.name}</span>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.mobile || "—"}</td>
                        <td className="um-reason-cell">{user.retire_reason || "—"}</td>
                        <td className="um-date-cell">
                          {user.retire_requested_at
                            ? new Date(user.retire_requested_at).toLocaleString("en-IN")
                            : "—"}
                        </td>
                        <td>
                          <div className="um-actions">
                            <button className="um-btn um-btn--delete" onClick={() => handleRetireAction(user.id, "approve")}>Approve</button>
                            <button className="um-btn um-btn--edit"   onClick={() => handleRetireAction(user.id, "reject")}>❌ Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="um-card-list">
                {retireRequests.map((user, idx) => (
                  <div key={user.id} className="um-card um-card--danger" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="um-card-head">
                      <div className="um-avatar um-avatar--red">{(user.name || "?")[0].toUpperCase()}</div>
                      <div className="um-card-info">
                        <div className="um-card-name">{user.name}</div>
                        <div className="um-card-email">{user.email}</div>
                      </div>
                    </div>
                    {user.retire_reason && (
                      <div className="um-card-reason">
                        <span className="um-reason-label">Reason:</span> {user.retire_reason}
                      </div>
                    )}
                    {user.retire_requested_at && (
                      <div className="um-card-date">
                        🕐 {new Date(user.retire_requested_at).toLocaleString("en-IN")}
                      </div>
                    )}
                    <div className="um-actions um-actions--card">
                      <button className="um-btn um-btn--delete" onClick={() => handleRetireAction(user.id, "approve")}>Approve</button>
                      <button className="um-btn um-btn--edit"   onClick={() => handleRetireAction(user.id, "reject")}>❌ Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ════════ EDIT MODAL ════════ */}
      {editingUser && (
        <div className="um-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEditingUser(null); }}>
          <div className="um-modal">
            <div className="um-modal-header">
              <h3 className="um-modal-title">✏️ Edit User</h3>
              <button className="um-modal-close" onClick={() => setEditingUser(null)}><IconClose /></button>
            </div>

            <div className="um-modal-body">
              <label className="um-label">Full Name</label>
              <input
                className="um-input"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
              />

              <label className="um-label">Phone Number</label>
              <input
                className="um-input"
                value={form.mobile}
                onChange={e => setForm({ ...form, mobile: e.target.value })}
                placeholder="Phone number"
              />

              <div className="um-toggle-row">
                <span className="um-toggle-label">Account Status</span>
                <label className="um-toggle">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                  />
                  <span className="um-toggle-track">
                    <span className="um-toggle-thumb" />
                  </span>
                  <span className="um-toggle-text">{form.is_active ? "Active" : "Blocked"}</span>
                </label>
              </div>
            </div>

            <div className="um-modal-footer">
              <button className="um-modal-btn um-modal-btn--cancel" onClick={() => setEditingUser(null)}>Cancel</button>
              <button className="um-modal-btn um-modal-btn--save"   onClick={updateUser}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}