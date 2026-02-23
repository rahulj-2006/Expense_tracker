import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// --- AUTH CONTEXT ---
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// --- COMPONENTS ---

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center transition-all duration-500">
      <Link to="/" className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
          <span className="text-white font-bold text-xl">₹</span>
        </div>
        <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          EXPENSE<span className="text-indigo-400">PRO</span>
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="text-xs font-black tracking-[0.2em] text-indigo-400 hover:text-indigo-300 transition-colors border-r border-white/10 pr-6 mr-2 uppercase"
              >
                CONSOLE
              </Link>
            )}
            <div className="hidden md:block text-right">
              <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Member</p>
              <p className="text-sm text-white font-bold">{user.username}</p>
            </div>
            <button
              onClick={logout}
              className="bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-300 px-6 py-2.5 rounded-full text-xs font-black tracking-widest transition-all border border-white/10 active:scale-95"
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/auth" className="text-xs font-black tracking-widest text-slate-400 hover:text-white transition-colors py-2.5">SIGN IN</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await axios.post(`${API_URL}${endpoint}`, formData);

      if (isLogin) {
        login(res.data.user, res.data.token);
        navigate('/');
      } else {
        setIsLogin(true);
        setError('Ready to login!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-slate-950 px-4 overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-slate-900/30 backdrop-blur-3xl border border-white/5 rounded-[40px] shadow-2xl overflow-hidden relative z-10">
        <div className="p-16 flex flex-col justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-white rounded-full blur-3xl group-hover:translate-x-10 group-hover:translate-y-10 transition-transform duration-1000"></div>
          </div>
          <h2 className="text-5xl font-black mb-6 leading-tight tracking-tighter">Your Assets,<br />Perfectly Logged.</h2>
          <p className="text-indigo-100 mb-10 leading-relaxed text-lg font-medium opacity-80">
            Streamline your financial life with high-fidelity tracking, beautiful visualizations, and cloud-native security.
          </p>
          <div className="space-y-6">
            {['AI-Powered Insights', 'Cross-Platform Sync', 'Premium Visualizations'].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group/item">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center group-hover/item:bg-white text-white group-hover/item:text-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <p className="font-bold text-sm tracking-wide uppercase">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-16 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h3 className="text-3xl font-black text-white mb-2 tracking-tight uppercase italic">{isLogin ? 'Welcome Back' : 'Create Profile'}</h3>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
              {isLogin ? "IDENTITY VERIFICATION REQUIRED" : "FILL IN THE CREDENTIALS BELOW"}
            </p>
          </div>

          {error && (
            <div className={`p-5 rounded-2xl mb-8 text-xs font-black tracking-widest uppercase border ${error.includes('Ready') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <input
                type="text"
                placeholder="USERNAME"
                className="w-full bg-slate-800/20 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:font-black placeholder:tracking-widest placeholder:text-slate-600"
                value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required
              />
            </div>
            {!isLogin && (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-2">
                <input
                  type="email"
                  placeholder="EMAIL"
                  className="w-full bg-slate-800/20 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:tracking-widest placeholder:text-slate-600"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="PHONE"
                  className="w-full bg-slate-800/20 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:tracking-widest placeholder:text-slate-600"
                  value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            )}
            <div>
              <input
                type="password"
                placeholder="PASSWORD"
                className="w-full bg-slate-800/20 border border-white/5 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:tracking-widest placeholder:text-slate-600"
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-5 rounded-2xl font-black tracking-[0.2em] transition-all shadow-xl shadow-indigo-950/40 mt-4 active:scale-95"
            >
              {loading ? 'PROCESSING...' : (isLogin ? 'INITIALIZE SESSION' : 'AUTHORIZE ACCOUNT')}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-500 text-[10px] font-black tracking-widest hover:text-indigo-400 transition-colors uppercase"
            >
              {isLogin ? "NEW RECRUIT? CREATE AN ACCOUNT" : "EXISTING USER? VERIFY IDENTITY"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total: 0, breakdown: [] });
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [formData, setFormData] = useState({ name: '', amount: '', category: 'Food' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [otherValue, setOtherValue] = useState('');

  const fetchData = async () => {
    try {
      const [expRes, sumRes] = await Promise.all([
        axios.get(`${API_URL}/expenses?month=${month}`),
        axios.get(`${API_URL}/expenses/summary?month=${month}`)
      ]);
      setExpenses(expRes.data);
      setSummary(sumRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month]);

  const handleAddExpense = async (e) => {
    if (e) e.preventDefault();
    if (formData.category === 'Other' && !showOtherModal) {
      setShowOtherModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (formData.category === 'Other' && otherValue) {
        payload.category = otherValue;
      }
      await axios.post(`${API_URL}/expenses`, payload);
      setFormData({ name: '', amount: '', category: 'Food' });
      setOtherValue('');
      setShowOtherModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#ec4899'];

  return (
    <div className="pt-24 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto space-y-12">
      {/* Visual Header */}
      <div className="relative p-16 rounded-[48px] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl group">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none group-hover:opacity-60 transition-opacity duration-1000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
              <span className="text-[10px] font-black tracking-[0.2em] text-indigo-300 uppercase">System Active</span>
            </div>
            <h1 className="text-6xl font-black text-white mb-6 tracking-tighter italic">
              Welcome, <span className="text-indigo-400 uppercase tracking-tighter">{user?.username}</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-xl font-medium leading-relaxed">
              Your financial portfolio has expanded by <span className="text-white font-black">₹{parseFloat(summary.total).toLocaleString()}</span> this billing cycle.
            </p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <label className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">Billing Cycle</label>
            <div className="flex bg-slate-800/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-transparent border-none text-white px-5 py-3 text-xl font-black focus:outline-none cursor-pointer uppercase tracking-tighter"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-12">
          <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
            <h3 className="text-sm font-black text-slate-500 mb-8 tracking-[0.4em] uppercase">Manual Entry</h3>
            <form onSubmit={handleAddExpense} className="space-y-6">
              <input
                type="text"
                className="w-full bg-slate-800/30 border border-white/5 rounded-3xl px-6 py-5 text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-slate-700"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="MERCHANT NAME" required
              />
              <div className="grid grid-cols-5 gap-4">
                <input
                  type="number" step="0.01"
                  className="col-span-3 bg-slate-800/30 border border-white/5 rounded-3xl px-6 py-5 text-white text-2xl font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-slate-700"
                  value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" required
                />
                <select
                  className="col-span-2 bg-slate-800/30 border border-white/5 rounded-3xl px-4 text-xs font-black text-indigo-400 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none text-center"
                  value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {['Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Other'].map(cat => (
                    <option key={cat} className="bg-slate-900">{cat}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-3xl font-black text-xs tracking-[0.3em] transition-all shadow-xl shadow-indigo-950/50 uppercase active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'COMMITTING...' : 'COMMIT LOG'}
              </button>
            </form>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[40px] shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-sm font-black text-slate-500 tracking-[0.4em] uppercase">Metrics</h3>
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">Allocation</div>
            </div>
            <div className="h-[320px] relative">
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-4xl font-black text-white italic">₹{Math.floor(summary.total).toLocaleString()}</span>
                <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">SUM</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.breakdown}
                    innerRadius={90}
                    outerRadius={115}
                    paddingAngle={10}
                    dataKey="total"
                    nameKey="category"
                    stroke="none"
                  >
                    {summary.breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<div className="hidden"></div>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-10">
              {summary.breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.category}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400">₹{parseFloat(item.total).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-slate-900/20 backdrop-blur-3xl border border-white/10 rounded-[48px] shadow-2xl overflow-hidden min-h-full flex flex-col">
            <div className="p-12 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-4 italic uppercase">
                Transaction Ledger
                <span className="text-[10px] font-black text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] not-italic">{expenses.length} Records</span>
              </h3>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/5 opacity-50">
                    <th className="px-12 py-8">Entity</th>
                    <th className="px-12 py-8">Classification</th>
                    <th className="px-12 py-8 text-right font-black">Fiscal Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {expenses.length > 0 ? expenses.map((exp) => (
                    <tr key={exp.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                      <td className="px-12 py-10">
                        <p className="text-white text-lg font-bold group-hover:translate-x-1 transition-transform">{exp.name}</p>
                        <p className="text-[10px] font-black text-slate-600 mt-1 uppercase tracking-widest">
                          {new Date(exp.created_at).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="px-12 py-10">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/40 border border-white/5">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{exp.category}</span>
                        </div>
                      </td>
                      <td className="px-12 py-10 text-right">
                        <p className="text-2xl font-black text-white group-hover:scale-110 transition-transform origin-right tracking-tighter italic">₹{parseFloat(exp.amount).toLocaleString()}</p>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="py-48 text-center">
                        <div className="opacity-10 group cursor-default">
                          <div className="text-[120px] font-black text-white tracking-tighter italic">NULL</div>
                          <p className="text-white font-black uppercase tracking-[0.5em] text-sm group-hover:tracking-[1em] transition-all duration-700">No Data Detected</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showOtherModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowOtherModal(false)}></div>
          <div className="relative bg-slate-900 border border-white/10 p-12 rounded-[40px] shadow-2xl max-w-md w-full animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-white mb-4 tracking-tighter italic uppercase">Specify Category</h3>
            <p className="text-slate-500 text-xs font-black tracking-widest mb-8 uppercase">Please define the classification for this asset.</p>
            <input
              type="text"
              autoFocus
              className="w-full bg-slate-800/30 border border-white/5 rounded-3xl px-6 py-5 text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-slate-700 mb-8"
              placeholder="e.g. ELECTRONICS, RENT..."
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
            />
            <div className="flex gap-4">
              <button
                onClick={() => setShowOtherModal(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-5 rounded-3xl font-black text-xs tracking-widest uppercase transition-all"
              >
                CANCEL
              </button>
              <button
                onClick={() => handleAddExpense()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-3xl font-black text-xs tracking-widest uppercase shadow-xl shadow-indigo-950/50 transition-all"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [userRes, expRes] = await Promise.all([
        axios.get(`${API_URL}/admin/users`),
        axios.get(`${API_URL}/admin/expenses`)
      ]);
      setUsers(userRes.data);
      setAllExpenses(expRes.data);
    } catch (err) {
      console.error("Admin fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-white font-black animate-pulse tracking-[0.5em]">INITIALIZING ADMIN PROTOCOL...</div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto space-y-12">
      <div className="relative p-16 rounded-[48px] overflow-hidden bg-slate-900 border border-indigo-500/20 shadow-2xl group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-black text-white mb-4 tracking-tighter italic">ADMIN <span className="text-indigo-400 uppercase">CONSOLE</span></h1>
          <p className="text-slate-400 text-xl font-medium">Global oversight of all system assets and identity records.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-12">
          <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[40px] shadow-2xl">
            <h3 className="text-sm font-black text-slate-500 mb-8 tracking-[0.4em] uppercase">Identity Registry</h3>
            <div className="space-y-4">
              {users.map(u => (
                <div key={u.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex justify-between items-center group hover:border-indigo-500/30 transition-all">
                  <div>
                    <p className="text-white font-bold">{u.username}</p>
                    <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase">{u.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-indigo-400 font-bold uppercase">{u.email || 'NO EMAIL'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-slate-900/20 backdrop-blur-3xl border border-white/10 rounded-[48px] shadow-2xl overflow-hidden min-h-full flex flex-col">
            <div className="p-12 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase">Global Assets Ledger</h3>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/5 opacity-50">
                    <th className="px-12 py-8">Asset & Custodian</th>
                    <th className="px-12 py-8">Classification</th>
                    <th className="px-12 py-8 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allExpenses.map((exp) => (
                    <tr key={exp.id} className="group hover:bg-white/[0.03] transition-all">
                      <td className="px-12 py-10">
                        <p className="text-white text-lg font-bold">{exp.name}</p>
                        <p className="text-[10px] font-black text-indigo-400 mt-1 uppercase tracking-widest">BY: {exp.User?.username || 'UNKNOWN'}</p>
                      </td>
                      <td className="px-12 py-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-800/40 px-3 py-1.5 rounded-lg border border-white/5">{exp.category}</span>
                      </td>
                      <td className="px-12 py-10 text-right">
                        <p className="text-2xl font-black text-white italic">₹{parseFloat(exp.amount).toLocaleString()}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950 font-sans tracking-tight selection:bg-indigo-500/30">
          <Navbar />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/auth" />;
};

const AdminRoute = ({ children }) => {
  const { user, token } = useAuth();
  return (token && user?.role === 'admin') ? children : <Navigate to="/" />;
};

export default App;
