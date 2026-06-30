import { useState, useEffect, useCallback, useMemo } from "react";
import { subDays, addDays, format, eachDayOfInterval } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Papa from 'papaparse';
import "./PaymentsReport.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

export default function PaymentsReport() {
  const [data, setData] = useState({
    summary: {},
    transactions: [],
    vendor_breakdown: [],
    filters: {},
    pagination: {}
  });
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('overview');
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: subDays(new Date(), 30),
    dateTo: new Date(),
    vendorId: '',
    search: '',
    page: 1
  });

  const fetchVendors = useCallback(async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${API_BASE}/api/vendors/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        setVendors(result || []);
      }
    } catch (err) {
      console.error('Failed to fetch vendors', err);
    }
  }, []);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      if (!token) return;

      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.dateFrom) params.append('date_from', format(filters.dateFrom, 'yyyy-MM-dd'));
      if (filters.dateTo) params.append('date_to', format(filters.dateTo, 'yyyy-MM-dd'));
      if (filters.vendorId) params.append('vendor_id', filters.vendorId);
      params.append('page', filters.page.toString());
      params.append('limit', '20');

      const url = `${API_BASE}/api/payments/report/?${params}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to fetch');
      const result = await res.json();

      if (result.success) {
        setData(result);
      }
    } catch (err) {
      console.error('Payments report error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVendors();
    fetchReport();
  }, [fetchVendors, fetchReport]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page) => {
    handleFilterChange('page', page);
  }, [handleFilterChange]);

  const exportCSV = useCallback(() => {
    const csv = Papa.unparse(data.transactions.map(t => ({
      'Txn ID': t.razorpay_payment_id,
      'User ID': t.user_id,
      'User Name': t.user_name,
      'Vendor ID': t.vendor_id,
      'Vendor Name': t.vendor_name,
      'Turf': t.turf_name,
      'Game': t.game_name,
      'Booking Date': format(new Date(t.booking_date), 'yyyy-MM-dd'),
      'Amount': `₹${(t.amount / 100).toFixed(2)}`,
      'Status': t.status
    })));
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  }, [data.transactions]);

  const chartData = useMemo(() => {
    // Simple mock revenue chart - can enhance with daily data later
    return {
      labels: ['Last 7d', 'Last 30d', 'All Time'],
      datasets: [{
        label: 'Revenue',
        data: [data.summary.vendorEarnings * 0.3, data.summary.vendorEarnings * 0.6, data.summary.vendorEarnings],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      }],
    };
  }, [data.summary]);

  const pieData = useMemo(() => {
    const labels = data.vendor_breakdown.map(v => v.vendor_name.slice(0, 15));
    const dataPie = data.vendor_breakdown.map(v => v.total_amount);
    return {
      labels,
      datasets: [{
        data: dataPie,
        backgroundColor: [
          '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
          '#ef4444', '#ec4899', '#f97316', '#14b8a6', '#8b5cf6'
        ],
      }],
    };
  }, [data.vendor_breakdown]);

  const datePresets = [
    { label: 'Last 7 days', from: subDays(new Date(), 7), to: new Date() },
    { label: 'Last 30 days', from: subDays(new Date(), 30), to: new Date() },
    { label: 'All time', from: null, to: null }
  ];

  return (
    <div className="payments-report">
      <div className="header">
        <h1>Payments & Reports</h1>
        <p className="subtitle">Dynamic revenue tracking with filters and analytics</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Date Range:</label>
          <div className="date-pickers">
            <DatePicker
              selected={filters.dateFrom}
              onChange={(date) => handleFilterChange('dateFrom', date)}
              selectsStart
              startDate={filters.dateFrom}
              endDate={filters.dateTo}
              dateFormat="yyyy-MM-dd"
              className="date-input"
            />
            <DatePicker
              selected={filters.dateTo}
              onChange={(date) => handleFilterChange('dateTo', date)}
              selectsEnd
              startDate={filters.dateFrom}
              endDate={filters.dateTo}
              dateFormat="yyyy-MM-dd"
              className="date-input"
            />
          </div>
          <div className="presets">
            {datePresets.map(preset => (
              <button
                key={preset.label}
                className="preset-btn"
                onClick={() => {
                  handleFilterChange('dateFrom', preset.from);
                  handleFilterChange('dateTo', preset.to);
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} className="filter-select">
            <option value="all">All</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Vendor:</label>
          <select value={filters.vendorId} onChange={(e) => handleFilterChange('vendorId', e.target.value)} className="filter-select">
            <option value="">All Vendors</option>
            {vendors.map(v => (
              <option key={v.vendor_id} value={v.vendor_id}>{v.venuename}</option>
            ))}
          </select>
        </div>

        <button className="export-btn" onClick={exportCSV} disabled={loading || data.transactions.length === 0}>
          📥 Export CSV
        </button>
        <button className="refresh-btn" onClick={fetchReport} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
          Overview
        </button>
        <button className={`tab-btn ${tab === 'transactions' ? 'active' : ''}`} onClick={() => setTab('transactions')}>
          Transactions ({data.summary.totalTransactions || 0})
        </button>
        <button className={`tab-btn ${tab === 'vendors' ? 'active' : ''}`} onClick={() => setTab('vendors')}>
          Vendors
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {tab === 'overview' && (
          <div className="overview-tab">
            {/* Summary Cards */}
            <div className="summary-grid">
              <div className="metric-card revenue">
                <h3>Total Revenue</h3>
                <div className="metric-value">
                  ₹{Number(data.summary.totalRevenue || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="metric-card commission">
                <h3>Admin Commission</h3>
                <div className="metric-value">
                  ₹{Number(data.summary.adminCommission || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="metric-card vendors">
                <h3>Vendor Earnings</h3>
                <div className="metric-value">
                  ₹{Number(data.summary.vendorEarnings || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="metric-card txns">
                <h3>Total Transactions</h3>
                <div className="metric-value">
                  {data.summary.totalTransactions || 0}
                </div>
              </div>
              <div className="metric-card avg">
                <h3>Avg Transaction</h3>
                <div className="metric-value">
                  ₹{Number(data.summary.avgTransaction || 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Revenue Breakdown</h3>
                <div className="pie-chart">
                  <Pie data={pieData} options={{ responsive: true }} />
                </div>
              </div>
              <div className="chart-card">
                <h3>Revenue Trend</h3>
                <div className="bar-chart">
                  <Bar data={chartData} options={{ responsive: true }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'transactions' && (
          <div className="transactions-tab">
            <div className="table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Txn ID</th>
                    <th>User</th>
                    <th>Turf</th>
                    <th>Vendor</th>
                    <th>Game</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="8" className="loading-row">Loading...</td></tr>
                  ) : data.transactions.length === 0 ? (
                    <tr><td colSpan="8" className="empty-row">No transactions found</td></tr>
                  ) : (
                    data.transactions.map((txn) => (
                      <tr key={txn.id}>
                        <td>{txn.razorpay_payment_id}</td>
                        <td>{txn.user_name} ({txn.user_id})</td>
                        <td>{txn.turf_name}</td>
                        <td>{txn.vendor_name} ({txn.vendor_id})</td>
                        <td>{txn.game_name}</td>
                        <td>{format(new Date(txn.booking_date), 'yyyy-MM-dd')}</td>
                        <td>₹{Number(txn.amount / 100).toLocaleString('en-IN')}</td>
                        <td><span className={`status ${txn.status.toLowerCase()}`}>{txn.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="pagination">
              <button
                disabled={loading || !data.pagination.has_prev}
                onClick={() => handlePageChange(data.pagination.current_page - 1)}
              >
                Prev
              </button>
              <span>
                Page {data.pagination.current_page} of {data.pagination.total_pages}
              </span>
              <button
                disabled={loading || !data.pagination.has_next}
                onClick={() => handlePageChange(data.pagination.current_page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {tab === 'vendors' && (
          <div className="vendors-tab">
            <div className="table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Vendor ID</th>
                    <th>Vendor Name</th>
                    <th>Total Revenue</th>
                    <th>Transactions</th>
                    <th>Avg per Txn</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="loading-row">Loading...</td></tr>
                  ) : data.vendor_breakdown.length === 0 ? (
                    <tr><td colSpan="5" className="empty-row">No vendor data</td></tr>
                  ) : (
                    data.vendor_breakdown.map((vendor) => (
                      <tr key={vendor.vendor_id}>
                        <td>{vendor.vendor_id}</td>
                        <td>{vendor.vendor_name}</td>
                        <td>₹{Number(vendor.total_amount).toLocaleString('en-IN')}</td>
                        <td>{vendor.txn_count}</td>
                        <td>₹{Number(vendor.total_amount / Math.max(vendor.txn_count, 1)).toLocaleString('en-IN')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

