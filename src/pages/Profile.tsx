import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Calendar, Shield } from "lucide-react";

export default function Profile() {
  const { user, profile } = useAuth();

  // Get display info from profile or fallback to user
  const displayName = profile?.name || user?.email?.split("@")[0] || "User";
  const userEmail = profile?.email || user?.email || "";
  const avatarUrl = profile?.avatar_url;
  const memberSince = profile?.created_at || user?.created_at;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 style={{
          fontSize: 'clamp(36px, 4vw, 60px)',
          fontWeight: '700',
          letterSpacing: '-2px',
          lineHeight: '1.0',
          color: 'var(--text)',
          marginBottom: '8px'
        }}>
          Profile
        </h1>
        <p style={{
          fontSize: '15px',
          fontWeight: '300',
          lineHeight: '1.7',
          color: 'var(--text2)'
        }}>
          Manage your account information
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="table-container"
      >
        <div className="table-header">
          <span className="table-header-title">Account Information</span>
        </div>
        <div style={{ padding: '40px' }}>
          <div className="flex items-center gap-6 mb-8">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-20 h-20 object-cover"
                style={{ borderRadius: '50%', border: '2px solid var(--green)' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div
                className="w-20 h-20 flex items-center justify-center text-3xl font-bold"
                style={{
                  background: 'var(--green)',
                  color: '#000',
                  borderRadius: '50%',
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'var(--text)',
                marginBottom: '4px'
              }}>
                {displayName}
              </h2>
              <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
                {userEmail}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="flex items-center gap-4 p-4"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
            >
              <Mail className="w-5 h-5" style={{ color: 'var(--green)' }} />
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Email</p>
                <p style={{ fontSize: '14px', color: 'var(--text)' }}>{user?.email || "N/A"}</p>
              </div>
            </div>
            <div
              className="flex items-center gap-4 p-4"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
            >
              <Shield className="w-5 h-5" style={{ color: 'var(--green)' }} />
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Authentication</p>
                <p style={{ fontSize: '14px', color: 'var(--text)' }}>Email + OAuth</p>
              </div>
            </div>
            <div
              className="flex items-center gap-4 p-4"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
            >
              <Calendar className="w-5 h-5" style={{ color: 'var(--green)' }} />
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Member Since</p>
                <p style={{ fontSize: '14px', color: 'var(--text)' }}>
                  {memberSince ? new Date(memberSince).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-4 p-4"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
            >
              <User className="w-5 h-5" style={{ color: 'var(--green)' }} />
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text3)' }}>User ID</p>
                <p style={{ fontSize: '14px', color: 'var(--text)' }}>
                  {user?.id ? `${user.id.slice(0, 8)}...` : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
