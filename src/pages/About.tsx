import { motion } from "framer-motion";
import { TrendingUp, Shield, Users, Target, Award, BarChart3 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-8">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              About <span className="text-primary">PSX Ledger</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your trusted companion for Pakistan Stock Exchange trading analytics, 
              portfolio management, and financial insights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At PSX Ledger, we believe that every trader deserves access to professional-grade 
              analytics tools. Whether you are a beginner taking your first steps in the Pakistan 
              Stock Exchange or an experienced investor managing a diversified portfolio, our 
              platform is designed to empower you with the insights you need to make informed 
              trading decisions.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Precision Analytics",
                description: "Track every trade with detailed analytics including profit/loss calculations, win rates, and performance metrics tailored specifically for PSX traders."
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your trading data is encrypted and stored securely. We prioritize your privacy with enterprise-grade security measures and never share your information."
              },
              {
                icon: Users,
                title: "Built for Traders",
                description: "Developed by traders who understand the unique challenges of the Pakistan Stock Exchange. Every feature is crafted to simplify your trading workflow."
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
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                PSX Ledger was born from a simple observation: traders in Pakistan needed better tools 
                to track their investments. While international platforms offered generic solutions, 
                none addressed the specific needs of Pakistan Stock Exchange investors. From 
                calculating capital gains tax to understanding PSX-specific market patterns, local 
                traders were left to manage their portfolios with spreadsheets and manual calculations.
              </p>
              <p className="mb-4">
                Founded in 2024, our team set out to build a comprehensive trading journal and 
                analytics platform specifically designed for the Pakistan Stock Exchange. We 
                understood that successful trading requires more than just buying low and selling 
                high—it requires discipline, data-driven decision making, and continuous learning 
                from past trades.
              </p>
              <p className="mb-4">
                Our platform has grown to serve thousands of active traders across Pakistan, from 
                Karachi to Islamabad, Lahore to Peshawar. We have helped our users track millions 
                of rupees in trades, identify profitable strategies, and ultimately become more 
                successful investors. Our commitment to continuous improvement means we regularly 
                add new features based on user feedback and market changes.
              </p>
              <p>
                Today, PSX Ledger stands as the premier trading analytics platform for Pakistani 
                investors. Whether you are trading blue-chip stocks like OGDC and ENGRO, exploring 
                opportunities in the banking sector, or investing in emerging companies, our tools 
                provide the insights you need to trade with confidence. Join our growing community 
                of informed traders and take your PSX investment journey to the next level.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive tools designed for serious PSX traders
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Track your portfolio performance with detailed equity curves, win/loss ratios, and monthly breakdowns. Visualize your trading journey with interactive charts."
              },
              {
                icon: Award,
                title: "Trade Journal",
                description: "Maintain a comprehensive record of all your trades with notes, emotions, and lessons learned. Review past decisions to improve future performance."
              },
              {
                icon: TrendingUp,
                title: "Real-time Tracking",
                description: "Monitor your open positions and overall portfolio value. Stay updated with market movements and their impact on your investments."
              },
              {
                icon: Shield,
                title: "Tax Reporting",
                description: "Generate comprehensive reports for tax filing. Track capital gains, losses, and dividends to simplify your annual tax returns."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-lg bg-card border"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Our Values</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="p-4">
                <h4 className="font-semibold mb-2">Transparency</h4>
                <p className="text-sm text-muted-foreground">
                  We believe in clear, honest communication with our users about how their data is used and how our platform operates.
                </p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold mb-2">Innovation</h4>
                <p className="text-sm text-muted-foreground">
                  We continuously improve our platform based on user feedback and emerging technologies to provide the best trading experience.
                </p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold mb-2">Reliability</h4>
                <p className="text-sm text-muted-foreground">
                  Your trading data is precious. We ensure 99.9% uptime and robust data backup systems to keep your records safe.
                </p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold mb-2">Community</h4>
                <p className="text-sm text-muted-foreground">
                  We foster a community of informed traders who share knowledge and help each other succeed in the Pakistan Stock Exchange.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have questions about PSX Ledger? We would love to hear from you. 
              Reach out to our team for support, feedback, or partnership inquiries.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
