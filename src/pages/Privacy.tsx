import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, Cookie, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: January 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-card border rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Lock className="w-6 h-6 text-primary" />
                Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to PSX Ledger. We respect your privacy and are committed to protecting your 
                personal data. This Privacy Policy explains how we collect, use, store, and 
                safeguard your information when you use our trading analytics platform. By using 
                PSX Ledger, you agree to the practices described in this policy. We take your privacy 
                seriously and implement industry-standard security measures to ensure your trading 
                data remains confidential and secure.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Database className="w-6 h-6 text-primary" />
                Information We Collect
              </h2>
              <p className="text-muted-foreground mb-4">
                We collect the following types of information to provide and improve our services:
              </p>
              <h3 className="text-lg font-semibold mt-6 mb-3">Personal Information</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Email address and authentication credentials when you create an account</li>
                <li>Name and contact information you voluntarily provide</li>
                <li>Profile information and preferences</li>
                <li>Device information including IP address, browser type, and operating system</li>
                <li>Usage data and analytics about how you interact with our platform</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">Trading Data</h3>
              <p className="text-muted-foreground mb-4">
                As a trading journal platform, we store the information you enter about your trades:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Stock symbols, quantities, and trade prices</li>
                <li>Entry and exit dates and times</li>
                <li>Trade notes, emotions, and strategy tags</li>
                <li>Calculated profit and loss figures</li>
                <li>Portfolio value history and equity curve data</li>
              </ul>
              <p className="text-muted-foreground">
                This trading data is considered highly sensitive and is encrypted both in transit 
                and at rest. We never share your individual trade data with third parties or use 
                it for any purpose other than providing our analytics services to you.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6 text-primary" />
                How We Use Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Service Provision:</strong> To provide and maintain our trading analytics platform, including calculating your portfolio statistics and generating performance reports.</li>
                <li><strong>Account Management:</strong> To authenticate your identity, secure your account, and provide customer support.</li>
                <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our features, user interface, and overall user experience.</li>
                <li><strong>Communication:</strong> To send you important updates, security alerts, and optional newsletters about new features (you can unsubscribe at any time).</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes when required.</li>
                <li><strong>Fraud Prevention:</strong> To detect, prevent, and address technical issues, security incidents, and fraudulent activity.</li>
              </ul>
            </div>

            <div className="bg-card border rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Cookie className="w-6 h-6 text-primary" />
                Cookies and Tracking Technologies
              </h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our 
                platform. Cookies are small text files stored on your device that help us:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Keep you signed in and maintain your session</li>
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our platform to improve functionality</li>
                <li>Provide analytics about site performance and usage</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <strong>Types of cookies we use:</strong>
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic site functionality and security. Cannot be disabled.</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and choices for a personalized experience.</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website (anonymized data).</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                You can control cookies through your browser settings. However, disabling certain 
                cookies may affect the functionality of our platform.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement comprehensive security measures to protect your personal and trading data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Encryption:</strong> All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.</li>
                <li><strong>Secure Infrastructure:</strong> Our servers are hosted in secure data centers with 24/7 monitoring and physical security.</li>
                <li><strong>Access Controls:</strong> Strict access controls ensure only authorized personnel can access systems, and only when necessary.</li>
                <li><strong>Regular Audits:</strong> We conduct regular security audits and penetration testing to identify and address vulnerabilities.</li>
                <li><strong>Data Backup:</strong> Automated daily backups with point-in-time recovery capabilities to prevent data loss.</li>
                <li><strong>Authentication:</strong> Multi-factor authentication support and secure password hashing using bcrypt.</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Despite our best efforts, no method of transmission over the Internet or electronic 
                storage is 100% secure. While we strive to use commercially acceptable means to 
                protect your personal information, we cannot guarantee absolute security.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Data Retention and Deletion</h2>
              <p className="text-muted-foreground mb-4">
                We retain your personal information for as long as your account is active or as 
                needed to provide you services. If you wish to delete your account:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>You can request account deletion through your account settings or by contacting us</li>
                <li>Upon deletion, your personal data will be permanently removed within 30 days</li>
                <li>We may retain anonymized, aggregated data for analytics purposes that cannot identify you</li>
                <li>Some information may be retained for legal compliance or legitimate business purposes as required by law</li>
              </ul>
            </div>

            <div className="bg-card border rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground mb-4">
                We may use trusted third-party services to help operate our platform:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Analytics:</strong> We use analytics tools to understand site usage (data is anonymized)</li>
                <li><strong>Authentication:</strong> We may use OAuth providers (Google, GitHub) for secure login options</li>
                <li><strong>Hosting:</strong> Our infrastructure is hosted on secure cloud providers</li>
                <li><strong>Email:</strong> We use email service providers to send communications</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                These third parties have access to your personal information only to perform 
                specific tasks on our behalf and are obligated not to disclose or use it for 
                any other purpose.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have certain rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data (right to be forgotten)</li>
                <li><strong>Restriction:</strong> Request limitation of processing your data</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to certain types of data processing</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise any of these rights, please contact us using the information provided 
                at the end of this policy.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Children&apos;s Privacy</h2>
              <p className="text-muted-foreground">
                Our platform is not intended for use by individuals under the age of 18. We do 
                not knowingly collect personal information from children under 18. If we become 
                aware that we have collected personal data from a child under 18 without parental 
                consent, we will take steps to remove that information from our servers. If you 
                believe we might have any information from or about a child under 18, please 
                contact us immediately.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update our Privacy Policy from time to time to reflect changes in our 
                practices, technology, legal requirements, or for other operational reasons. We 
                will notify you of any material changes by posting the new Privacy Policy on this 
                page and updating the &quot;Last updated&quot; date. We encourage you to review this 
                Privacy Policy periodically for any changes. Your continued use of our platform 
                after any modifications indicates your acceptance of the updated policy.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Mail className="w-6 h-6 text-primary" />
                Contact Us
              </h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy 
                or our data practices, please contact us:
              </p>
              <div className="bg-muted rounded-lg p-6">
                <p className="font-medium mb-2">PSX Ledger</p>
                <p className="text-muted-foreground text-sm mb-1">Email: privacy@psxledger.com</p>
                <p className="text-muted-foreground text-sm mb-1">Address: Karachi, Pakistan</p>
                <p className="text-muted-foreground text-sm">
                  Response Time: We aim to respond to all privacy inquiries within 48 hours.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <p className="text-sm text-muted-foreground text-center">
                By using PSX Ledger, you acknowledge that you have read and understood this 
                Privacy Policy and agree to its terms. Thank you for trusting us with your 
                trading data.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
