import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageCircle, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We will get back to you within 24 hours.",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about PSX Ledger? We are here to help. Reach out to our team 
              for support, feedback, or partnership opportunities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Mail,
                title: "Email Us",
                content: "support@psxledger.com",
                description: "For general inquiries and support"
              },
              {
                icon: MapPin,
                title: "Visit Us",
                content: "Karachi, Pakistan",
                description: "Our headquarters location"
              },
              {
                icon: Clock,
                title: "Response Time",
                content: "Within 24 hours",
                description: "We aim to respond quickly"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-lg bg-card border"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-primary font-medium mb-1">{item.content}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="How can we help you?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  question: "How do I get started with PSX Ledger?",
                  answer: "Simply create a free account, verify your email, and start logging your trades. Our intuitive interface makes it easy to begin tracking your Pakistan Stock Exchange investments right away."
                },
                {
                  question: "Is my trading data secure?",
                  answer: "Absolutely. We use bank-level encryption (AES-256) for all your data, both in transit and at rest. Your trading information is never shared with third parties."
                },
                {
                  question: "Can I export my trading data?",
                  answer: "Yes! You can export your complete trade history in CSV format at any time. This makes tax reporting and external analysis simple and convenient."
                },
                {
                  question: "Do you offer mobile apps?",
                  answer: "Currently, we offer a responsive web application that works perfectly on mobile browsers. Native iOS and Android apps are on our roadmap for 2025."
                },
                {
                  question: "Is PSX Ledger free to use?",
                  answer: "We offer a generous free tier with essential features. Premium plans with advanced analytics and unlimited trade history are available for power users."
                },
                {
                  question: "How do I report a bug or suggest a feature?",
                  answer: "We love hearing from our users! Use this contact form to submit feedback, or email us directly at support@psxledger.com with your suggestions."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-card border rounded-lg p-6">
                  <h4 className="font-semibold mb-2 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h4>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Alternative Contact Methods */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4">Other Ways to Reach Us</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Prefer to connect through other channels? Here are additional ways to get in touch 
              with our team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:support@psxledger.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>support@psxledger.com</span>
              </a>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border">
                <Phone className="w-5 h-5" />
                <span>+92-XXX-XXXXXXX</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
