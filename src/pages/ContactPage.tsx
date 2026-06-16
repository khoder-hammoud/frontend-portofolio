import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Globe, ArrowRight, Zap, Github, Linkedin, AlertCircle } from "lucide-react";
import { WhatsAppIcon } from "../components/Icons";
import { useData } from "../DataContext";
import SEO from "../components/SEO";

const ContactPage = () => {
  const { settings } = useData();
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formState.name.trim()) errors.name = 'Name is required';
    if (!formState.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) errors.email = 'Invalid email format';
    if (!formState.subject.trim()) errors.subject = 'Subject is required';
    if (!formState.message.trim()) errors.message = 'Message is required';
    else if (formState.message.trim().length < 10) errors.message = 'Message must be at least 10 characters';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const { messagesAPI } = await import('../services/api');
      await messagesAPI.create({
        name: formState.name,
        email: formState.email,
        subject: formState.subject,
        message: formState.message,
      });

      setIsSent(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSent(false), 5000);
    } catch (err: any) {
      console.error('Send Message Error:', err);
      setError('Failed to send message. Please try contacting me via WhatsApp or email below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="pt-12"
    >
      <SEO
        title="Contact | Khoder Hammoud Portfolio"
        description="Get in touch for new projects, creative ideas, or collaboration opportunities."
        keywords="contact, hire developer, freelance, collaboration, web development"
        url="/contact"
      />
      
      {/* Contact Header */}
      <div className="mb-16">
        <h1 className="text-4xl md:text-7xl font-black text-app-text mb-4 tracking-tighter uppercase font-display">
          <span className="text-neon-purple">CONTACT</span>
        </h1>
        <p className="text-lg text-app-text-muted leading-relaxed max-w-2xl">
          Have a project in mind or just want to say hi? Feel free to reach out. I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Contact Form */}
        <div className="relative">
          <div className="absolute -inset-4 bg-neon-purple/5 blur-3xl rounded-full pointer-events-none" />
           
          <form onSubmit={handleSubmit} className="relative space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest ml-1">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={formState.name}
                  onChange={(e) => { setFormState({ ...formState, name: e.target.value }); setFormErrors(prev => ({ ...prev, name: '' })); }}
                  className={`w-full bg-card-bg border rounded-lg px-4 py-4 text-app-text focus:outline-none focus:border-neon-cyan transition-colors ${formErrors.name ? 'border-red-500' : 'border-app-border'}`}
                  placeholder="John Doe"
                />
                {formErrors.name && <p className="text-[9px] text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formState.email}
                  onChange={(e) => { setFormState({ ...formState, email: e.target.value }); setFormErrors(prev => ({ ...prev, email: '' })); }}
                  className={`w-full bg-card-bg border rounded-lg px-4 py-4 text-app-text focus:outline-none focus:border-neon-cyan transition-colors ${formErrors.email ? 'border-red-500' : 'border-app-border'}`}
                  placeholder="john@example.com"
                />
                {formErrors.email && <p className="text-[9px] text-red-500 mt-1">{formErrors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest ml-1">Subject</label>
              <input 
                type="text" 
                required
                value={formState.subject}
                onChange={(e) => { setFormState({ ...formState, subject: e.target.value }); setFormErrors(prev => ({ ...prev, subject: '' })); }}
                className={`w-full bg-card-bg border rounded-lg px-4 py-4 text-app-text focus:outline-none focus:border-neon-cyan transition-colors ${formErrors.subject ? 'border-red-500' : 'border-app-border'}`}
                placeholder="Project Inquiry"
              />
              {formErrors.subject && <p className="text-[9px] text-red-500 mt-1">{formErrors.subject}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest ml-1">Message</label>
              <textarea 
                required
                rows={5}
                value={formState.message}
                onChange={(e) => { setFormState({ ...formState, message: e.target.value }); setFormErrors(prev => ({ ...prev, message: '' })); }}
                className={`w-full bg-card-bg border rounded-lg px-4 py-4 text-app-text focus:outline-none focus:border-neon-cyan transition-colors resize-none ${formErrors.message ? 'border-red-500' : 'border-app-border'}`}
                placeholder="Tell me about your project..."
              />
              {formErrors.message && <p className="text-[9px] text-red-500 mt-1">{formErrors.message}</p>}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-500"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold mb-2">{error}</p>
                    <div className="text-xs space-y-1">
                      <p className="font-semibold">Try contacting me directly:</p>
                      <div className="flex flex-col gap-1 mt-2">
                        {settings.whatsappNumber && (
                          <a 
                            href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-white transition-colors"
                          >
                            📱 WhatsApp: {settings.whatsappNumber}
                          </a>
                        )}
                        <a 
                          href={`mailto:${settings.contactEmail || 'hello@ag-portfolio.com'}`}
                          className="flex items-center gap-2 hover:text-white transition-colors"
                        >
                          ✉️ Email: {settings.contactEmail || 'hello@ag-portfolio.com'}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-lg font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 ${
                isSent 
                  ? "bg-green-500 text-app-text" 
                  : "bg-transparent border border-neon-purple text-neon-purple hover:bg-neon-purple/10 hover:shadow-[0_0_20px_rgba(188,19,254,0.4)]"
              }`}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-neon-purple border-t-transparent rounded-full animate-spin" />
              ) : isSent ? (
                <>Message Sent! <Zap size={18} /></>
              ) : (
                <>Send Message <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>
        </div>

        {/* Contact Info Cards */}
        <div className="space-y-8">
          <a 
            href={`mailto:${settings.contactEmail || 'hello@ag-portfolio.com'}`}
            className="block p-8 rounded-2xl bg-card-bg border border-app-border hover:border-neon-cyan transition-all group"
          >
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-xl bg-neon-cyan/10 text-neon-cyan">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-app-text-muted uppercase tracking-widest mb-1">Email Me</h3>
                <p className="text-lg sm:text-xl font-bold text-app-text group-hover:text-neon-cyan transition-colors break-all">
                  {settings.contactEmail || 'hello@ag-portfolio.com'}
                </p>
              </div>
            </div>
          </a>

          <div className="p-8 rounded-2xl bg-card-bg border border-app-border hover:border-neon-purple transition-all group">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-xl bg-neon-purple/10 text-neon-purple">
                <Globe size={28} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-app-text-muted uppercase tracking-widest mb-1">Location</h3>
                <p className="text-lg sm:text-xl font-bold text-app-text group-hover:text-neon-purple transition-colors break-all">{settings.location || 'Remote / Worldwide'}</p>
              </div>
            </div>
          </div>

          {settings.whatsappNumber && (
            <div className="p-8 rounded-2xl bg-card-bg border border-app-border hover:border-green-500 transition-all group">
              <a href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-6">
                <div className="p-4 rounded-xl bg-green-500/10 text-green-500">
                  <WhatsAppIcon size={28} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-app-text-muted uppercase tracking-widest mb-1">WhatsApp</h3>
                  <p className="text-lg sm:text-xl font-bold text-app-text group-hover:text-green-500 transition-colors break-all">{settings.whatsappNumber}</p>
                </div>
              </a>
            </div>
          )}

          <div className="p-8 rounded-2xl bg-card-bg border border-app-border overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <Linkedin size={120} />
            </div>
            <h3 className="text-xs font-bold text-app-text-muted uppercase tracking-widest mb-6">Find Me On</h3>
            <div className="flex gap-4">
              <a href={settings.githubUri} target="_blank" rel="noopener noreferrer">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-4 rounded-xl bg-card-bg border border-app-border hover:border-neon-cyan text-app-text-muted hover:text-app-text transition-all cursor-pointer"
                >
                  <Github size={24} />
                </motion.div>
              </a>
              <a href={settings.linkedinUri} target="_blank" rel="noopener noreferrer">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-4 rounded-xl bg-card-bg border border-app-border hover:border-neon-cyan text-app-text-muted hover:text-app-text transition-all cursor-pointer"
                >
                  <Linkedin size={24} />
                </motion.div>
              </a>
              {settings.whatsappNumber && (
                <a href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="p-4 rounded-xl bg-card-bg border border-app-border hover:border-green-500 text-app-text-muted hover:text-app-text transition-all cursor-pointer"
                  >
                    <WhatsAppIcon size={24} />
                  </motion.div>
                </a>
              )}
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-4 rounded-xl bg-card-bg border border-app-border hover:border-neon-cyan text-app-text-muted hover:text-app-text transition-all cursor-pointer"
              >
                <Mail size={24} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;