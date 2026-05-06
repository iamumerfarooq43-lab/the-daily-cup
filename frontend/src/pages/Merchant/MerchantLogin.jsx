import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'  // ✅ use real auth

function MerchantLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)

    // ✅ Real backend call — stores JWT token in localStorage
    const result = await login(email, password)

    if (result.success) {
      // ✅ Check role — only merchants can access dashboard
      if (result.user.role !== 'merchant') {
        setError('Access denied. This portal is for merchants only.')
        setLoading(false)
        return
      }
      navigate('/dashboard')
    } else {
      setError(result.message || 'Invalid merchant credentials.')
      setLoading(false)
    }
  }

  return (
    <div
      style={{ background: '#0c0e14', minHeight: '100vh' }}
      className="flex items-center justify-center px-4"
    >
      <div
        style={{
          background: '#13151f',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: '40px 36px',
          width: '100%',
          maxWidth: 400,
        }}
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <div
            style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.25)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 22,
              margin: '0 auto 14px',
            }}
          >
            ☕
          </div>
          <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
            The Daily Cup
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
            Merchant Portal — Sign in to your dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 16,
            }}
          >
            <p style={{ color: '#f87171', fontSize: 12 }}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="merchant@dailycup.com"
              style={{
                width: '100%', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '11px 14px',
                fontSize: 13, color: '#fff', outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '11px 14px',
                fontSize: 13, color: '#fff', outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: 10,
              border: 'none',
              background: loading ? 'rgba(245,158,11,0.4)' : '#f59e0b',
              color: '#000', fontSize: 13, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 4, transition: 'all 0.2s',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in to Dashboard'}
          </button>
        </form>

        {/* Demo credentials */}
        <div
          style={{
            marginTop: 20, padding: '12px 14px',
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.15)',
            borderRadius: 10,
          }}
        >
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>
            Demo credentials:
          </p>
          <p style={{ fontSize: 12, color: 'rgba(245,158,11,0.7)', fontFamily: 'monospace' }}>
            merchant@dailycup.com
          </p>
          <p style={{ fontSize: 12, color: 'rgba(245,158,11,0.7)', fontFamily: 'monospace' }}>
            merchant123
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 20 }}>
          Not a merchant?{' '}
          <Link to="/" style={{ color: 'rgba(245,158,11,0.7)' }}>
            Back to customer site
          </Link>
        </p>
      </div>
    </div>
  )
}

export default MerchantLogin