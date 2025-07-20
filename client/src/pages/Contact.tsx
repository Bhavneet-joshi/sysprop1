import React, { useState } from 'react';

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
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 dark:text-white">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" name="name" placeholder="Your Name" required value={form.name} onChange={handleChange} className="input-field" />
            <input type="email" name="email" placeholder="Your Email" required value={form.email} onChange={handleChange} className="input-field" />
            <textarea name="message" placeholder="Your Message" required rows={5} value={form.message} onChange={handleChange} className="input-field"></textarea>
            <button type="submit" className="btn-primary w-full">Send Message</button>
          </form>
          {feedback && <p className="mt-4 text-green-600 dark:text-green-400">{feedback}</p>}
        </div>
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Our Location</h2>
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
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">HLSG Industries Pvt. Ltd.</h3>
            <p className="text-gray-600 dark:text-gray-400">123 Industrial Avenue, Tech City, Country</p>
            <p className="text-gray-600 dark:text-gray-400">Phone: +1 234 567 8900</p>
            <p className="text-gray-600 dark:text-gray-400">Email: info@hlsgindustries.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
