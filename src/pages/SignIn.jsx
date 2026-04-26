import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import LeftPanel from '../components/LeftPanel'

export default function SignIn() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function handleSubmit() {
    const e = {}

    if (!form.email.endsWith('@u.northwestern.edu') && !form.email.endsWith('@northwestern.edu'))
      e.email = 'Please use your Northwestern email address.'

    if (form.password.length < 8)
      e.password = 'Password must be at least 8 characters.'

    if (Object.keys(e).length) { setErrors(e); return }

    const users = JSON.parse(localStorage.getItem('classhub_users') || '[]')
    const match = users.find(u => u.email === form.email)

    if (!match) {
      setErrors({ email: 'No account found with this email.' })
      return
    }

    // Successful sign in — navigate to dashboard
    navigate('/')
  }

  return (
    <div className="flex min-h-screen">
      <LeftPanel />

      {/* right */}
      <div className="flex flex-col flex-1 bg-white">
        {/* top nav */}
        <div className="flex items-center justify-end px-12 h-[58px] border-b border-gray-100 text-sm text-gray-500 flex-shrink-0">
          No account?{' '}
          <Link to="/signup" className="text-[#4F2582] font-semibold ml-1 hover:underline">
            Sign up
          </Link>
        </div>

        {/* body */}
        <div className="flex flex-1 items-center justify-center px-12 py-10">
          <div className="w-full max-w-[400px]">

            {/* header */}
            <div className="mb-7">
              <h2 className="font-serif text-[28px] text-gray-900 leading-tight mb-1">
                Welcome back.
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Sign in to your ClassHub account to continue.
              </p>
            </div>

            {/* google */}
            <button
              onClick={() => {}}
              className="w-full h-11 flex items-center justify-center gap-2 border border-gray-200 rounded-[10px] text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors mb-5"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* divider */}
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-5">
              <div className="flex-1 h-px bg-gray-100" />
              or
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* form */}
            <div className="flex flex-col gap-[14px]">

              {/* email */}
              <Field label="Northwestern email" error={errors.email}>
                <input
                  type="email"
                  placeholder="janedoe@u.northwestern.edu"
                  autoComplete="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  className={inputCls(errors.email)}
                />
              </Field>

              {/* password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[12.5px] font-semibold text-gray-900 tracking-[0.01em]">
                    Password
                  </label>
                  <a href="#" className="text-[12.5px] text-[#4F2582] font-medium hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Your password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    className={`${inputCls(errors.password)} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    <EyeIcon />
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* submit */}
              <button
                onClick={handleSubmit}
                className="w-full h-11 bg-[#4F2582] hover:bg-[#3B1A61] text-white text-sm font-semibold rounded-[10px] transition-colors mt-1 hover:shadow-lg"
              >
                Sign in
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

/* ── helpers ── */
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12.5px] font-semibold text-gray-900 tracking-[0.01em]">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

function inputCls(error) {
  return `h-[42px] w-full border rounded-[9px] px-3 text-sm text-gray-900 bg-white outline-none transition-all
    ${error
      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-gray-200 focus:border-[#4F2582] focus:ring-2 focus:ring-[#4F2582]/10'
    }`
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.3 33.9 29.7 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-20 0-1.3-.2-2.7-.5-4z" />
      <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 16.2 3 9.4 7.9 6.3 14.7z" />
      <path fill="#FBBC05" d="M24 45c5.5 0 10.5-1.9 14.4-5.1l-6.7-5.5C29.6 36 26.9 37 24 37c-5.7 0-10.3-3.1-11.8-7.5l-7 5.4C8.9 41.5 15.9 45 24 45z" />
      <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.8 2.4-2.3 4.4-4.3 5.9l6.7 5.5C42.1 36.2 45 30.6 45 24c0-1.3-.2-2.7-.5-4z" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
