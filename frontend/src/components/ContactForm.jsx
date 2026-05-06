import { useState } from 'react'
import { createTicket } from '../api/tickets'
import { toast } from 'sonner'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', category: '', message: '',
  })
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const ticket = await createTicket(formData)
      setSubmitted(true)
      toast.success(`Ticket ${ticket.ticketNumber} submitted! We'll get back to you soon.`)
      setTimeout(() => {
        setFormData({ name: '', email: '', category: '', message: '' })
        setSubmitted(false)
      }, 3000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm h-full">
      <span className="inline-block text-xs font-semibold tracking-widest uppercase text-fav1 border border-fav1 px-4 py-1.5 rounded-full mb-6">
        Send a Message
      </span>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <span className="text-5xl">☕</span>
          <p className="text-fav4 font-bold text-lg">Message Sent!</p>
          <p className="text-fav6 text-sm text-center">
            Thank you! We'll get back to you soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-fav4 mb-2 tracking-wide uppercase">
                Your Name
              </label>
              <input
                type="text" name="name"
                value={formData.name} onChange={handleChange}
                placeholder="John Doe" required
                className="w-full px-4 py-3 bg-fav3/30 border border-fav3
                           rounded-xl text-fav5 placeholder:text-fav7 text-sm
                           focus:outline-none focus:ring-2 focus:ring-fav1
                           focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-fav4 mb-2 tracking-wide uppercase">
                Email Address
              </label>
              <input
                type="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="john@example.com" required
                className="w-full px-4 py-3 bg-fav3/30 border border-fav3
                           rounded-xl text-fav5 placeholder:text-fav7 text-sm
                           focus:outline-none focus:ring-2 focus:ring-fav1
                           focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-fav4 mb-2 tracking-wide uppercase">
              Issue Category
            </label>
            <select
              name="category" value={formData.category}
              onChange={handleChange} required
              className="w-full px-4 py-3 bg-fav3/30 border border-fav3
                         rounded-xl text-fav5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-fav1
                         focus:border-transparent transition"
            >
              <option value="">Select a category...</option>
              <option value="order_issue">Order Issue</option>
              <option value="support">Support Request</option>
              <option value="feedback">General Feedback</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-fav4 mb-2 tracking-wide uppercase">
              Message
            </label>
            <textarea
              name="message" value={formData.message}
              onChange={handleChange}
              placeholder="Tell us how we can help..."
              required rows="5"
              className="w-full px-4 py-3 bg-fav3/30 border border-fav3
                         rounded-xl text-fav5 placeholder:text-fav7 text-sm
                         focus:outline-none focus:ring-2 focus:ring-fav1
                         focus:border-transparent transition resize-none"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="group w-full bg-fav4 hover:bg-fav5 disabled:bg-fav6
                       text-fav3 font-semibold py-3 rounded-full
                       transition-all duration-300 shadow-md hover:shadow-lg
                       flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-fav3/30 border-t-fav3 rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}

export default ContactForm