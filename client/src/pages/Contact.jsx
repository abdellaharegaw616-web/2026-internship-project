import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/layout/PublicNavbar';
import PublicFooter from '../components/layout/PublicFooter';
import {
  Menu,
  X,
  Mail,
  MapPin,
  HeadphonesIcon,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import LogoMark from '../components/LogoMark';
import { CONTACT_INFO, COMPANY_INFO } from '../constants/contactInfo';

const INITIAL_FORM = {
  fullName: '',
  email: '',
  subject: '',
  message: '',
};

const INITIAL_ERRORS = {
  fullName: '',
  email: '',
  subject: '',
  message: '',
};

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validateForm(values) {
  const errors = { ...INITIAL_ERRORS };
  let valid = true;

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.';
    valid = false;
  }

  if (!values.email.trim()) {
    errors.email = 'Email address is required.';
    valid = false;
  } else if (!validateEmail(values.email)) {
    errors.email = 'Please enter a valid email address.';
    valid = false;
  }

  if (!values.subject.trim()) {
    errors.subject = 'Subject is required.';
    valid = false;
  }

  if (!values.message.trim()) {
    errors.message = 'Message is required.';
    valid = false;
  } else if (values.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
    valid = false;
  }

  return { errors, valid };
}

export default function Contact() {
    const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [touched, setTouched] = useState({});

  // ── Handlers ───────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error on change if field was already touched
    if (touched[name]) {
      const { errors: newErrors } = validateForm({ ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const { errors: newErrors } = validateForm(form);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mark all fields as touched
    setTouched({ fullName: true, email: true, subject: true, message: true });

    const { errors: validationErrors, valid } = validateForm(form);
    setErrors(validationErrors);
    if (!valid) return;

    setSubmitting(true);
    setSubmitStatus(null);

    try {
      /**
       * No public contact API exists on the backend.
       * This section is intentionally prepared for future API integration.
       *
       * To connect to a real API, replace the simulated delay below with:
       *   import api from '../api/axios';
       *   await api.post('/contact', { ...form });
       *
       * The backend endpoint would be:  POST /api/contact
       */
      await new Promise((resolve) => setTimeout(resolve, 1200)); // simulate network delay

      // If a real API call is wired up and throws, it will be caught below.
      setSubmitStatus('success');
      setForm(INITIAL_FORM);
      setTouched({});
      setErrors(INITIAL_ERRORS);
    } catch {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Contact info cards ─────────────────────────────────────
  const contactCards = [
    {
      icon: Mail,
      label: 'Email',
      value: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: CONTACT_INFO.location,
      href: null,
    },
    {
      icon: HeadphonesIcon,
      label: 'Support',
      value: CONTACT_INFO.supportName,
      href: null,
    },
  ];

  // ── Field helper ───────────────────────────────────────────
  const inputClass = (name) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm text-gray-900 bg-white outline-none transition-colors placeholder:text-gray-400 ${
      errors[name] && touched[name]
        ? 'border-red-400 focus:border-red-500'
        : 'border-gray-200 focus:border-[#2563EB]'
    }`;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <PublicNavbar />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-sm text-[#2563EB] mb-6">
            <span>Contact</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-5 leading-tight">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600">
            Have a question about TaskFlow or want to learn more? Send us a message and we will
            get back to you.
          </p>
        </div>
      </section>

      {/* ── Two-column layout ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* ── LEFT: contact info ─────────────────────────────── */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact TaskFlow</h2>
            <div className="flex flex-col gap-4">
              {contactCards.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm text-gray-800 hover:text-[#2563EB] transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-800">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: contact form ────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Send a Message</h2>

            {/* Success banner */}
            {submitStatus === 'success' && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">
                  Your message has been sent successfully. We will get back to you soon.
                </p>
              </div>
            )}

            {/* Error banner */}
            {submitStatus === 'error' && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">
                  Something went wrong. Please try again or email us directly at{' '}
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="underline hover:text-red-700"
                  >
                    {CONTACT_INFO.email}
                  </a>
                  .
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={submitting}
                  className={inputClass('fullName')}
                  aria-describedby={errors.fullName && touched.fullName ? 'fullName-error' : undefined}
                  aria-invalid={!!(errors.fullName && touched.fullName)}
                />
                {errors.fullName && touched.fullName && (
                  <p id="fullName-error" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={submitting}
                  className={inputClass('email')}
                  aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                  aria-invalid={!!(errors.email && touched.email)}
                />
                {errors.email && touched.email && (
                  <p id="email-error" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What is this about?"
                  value={form.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={submitting}
                  className={inputClass('subject')}
                  aria-describedby={errors.subject && touched.subject ? 'subject-error' : undefined}
                  aria-invalid={!!(errors.subject && touched.subject)}
                />
                {errors.subject && touched.subject && (
                  <p id="subject-error" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={submitting}
                  className={`${inputClass('message')} resize-none`}
                  aria-describedby={errors.message && touched.message ? 'message-error' : undefined}
                  aria-invalid={!!(errors.message && touched.message)}
                />
                {errors.message && touched.message && (
                  <p id="message-error" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-xl text-sm font-medium hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <PublicFooter />
    </div>
  );
}
