import React, { useState } from 'react';
import { Mail, Phone, MapPin, User } from 'lucide-react';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [feedback, setFeedback] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message.');
      }
      setFeedback('Thank you for your message! We will get back to you shortly.');
      setForm({ name: '', email: '', message: '' });
    } catch (error: any) {
      setFeedback(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-gold-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full mx-auto">
        <h1 className="text-4xl font-extrabold text-navyblue dark:text-gold-400 mb-2 text-center drop-shadow-lg">Contact Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 text-center">We'd love to hear from you! Reach out with your questions, feedback, or partnership ideas.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-gold-200/40">
            <h2 className="text-2xl font-bold text-navyblue dark:text-gold-400 mb-4 flex items-center gap-2"><Mail className="w-6 h-6 text-gold-500" />Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400 w-5 h-5" />
                <input type="text" name="name" placeholder="Your Name" required value={form.name} onChange={handleChange} className="pl-10 input-field focus:ring-2 focus:ring-gold-400 transition" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400 w-5 h-5" />
                <input type="email" name="email" placeholder="Your Email" required value={form.email} onChange={handleChange} className="pl-10 input-field focus:ring-2 focus:ring-gold-400 transition" />
              </div>
              <textarea name="message" placeholder="Your Message" required rows={5} value={form.message} onChange={handleChange} className="input-field focus:ring-2 focus:ring-gold-400 transition"></textarea>
              <button type="submit" className="btn-primary w-full bg-gradient-to-r from-gold-400 to-navyblue text-white font-bold py-2 rounded-lg shadow-lg hover:from-navyblue hover:to-gold-400 transition-all duration-200">Send Message</button>
            </form>
            {feedback && <div className="mt-4 p-3 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-center font-semibold shadow animate-pulse-slow">{feedback}</div>}
          </div>
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-gold-200/40">
              <h2 className="text-2xl font-bold text-navyblue dark:text-gold-400 mb-4 flex items-center gap-2"><MapPin className="w-6 h-6 text-gold-500" />Our Location</h2>
              <div className="w-full h-80 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <iframe
                  title="HLSG Industries Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019123456789!2d-122.419415684681!3d37.7749297797597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c2f2b1b1b%3A0x123456789abcdef!2sTech%20City!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  allowFullScreen={true}
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-navyblue dark:text-gold-400 mb-2 flex items-center gap-2"><Mail className="w-5 h-5 text-gold-400" />HLSG Industries Pvt. Ltd.</h3>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2"><MapPin className="w-4 h-4 text-gold-400" />123 Industrial Avenue, Tech City, Country</p>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2"><Phone className="w-4 h-4 text-gold-400" />+1 234 567 8900</p>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2"><Mail className="w-4 h-4 text-gold-400" />info@hlsgindustries.com</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          color: #1a202c;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: #FFD700;
          box-shadow: 0 0 0 2px #FFD70033;
        }
        .btn-primary {
          background: linear-gradient(90deg, #FFD700 0%, #1e3a8a 100%);
        }
        .animate-pulse-slow {
          animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default Contact;
