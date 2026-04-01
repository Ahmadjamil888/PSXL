import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, User, Tag, ArrowLeft, ArrowRight } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import {
  getPostBySlug,
  getPostContentBySlug,
  getSortedPosts,
  formatDate,
  type BlogPost,
} from "@/data/blogPosts";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const post = slug ? getPostBySlug(slug) : undefined;
  const content = slug ? getPostContentBySlug(slug) : null;
  const allPosts = getSortedPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost: BlogPost | undefined = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined;
  const nextPost: BlogPost | undefined = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <PublicLayout>
      {/* Hero */}
      <section style={{ background: "var(--bg)", padding: "clamp(16px, 3vw, 28px) clamp(16px, 4vw, 48px)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Back link */}
            <Link to="/blog" style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontSize: "12px", fontWeight: 500, color: "var(--text2)",
              textDecoration: "none", marginBottom: "24px",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text2)")}
            >
              <ArrowLeft size={13} /> Back to Blog
            </Link>

            {/* Category */}
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "var(--green)",
              background: "rgba(163,196,90,0.1)", padding: "4px 10px",
              borderRadius: "4px", marginBottom: "16px",
            }}>
              <Tag size={10} />
              {post.category}
            </span>

            {/* Title */}
            <h1 style={{
              fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700,
              letterSpacing: "-1px", color: "var(--text)", lineHeight: 1.2,
              marginBottom: "12px",
              textAlign: "center"
            }}>
              {post.title}
            </h1>

            {/* Meta */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", justifyContent: "center", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text2)" }}>
                <Calendar size={12} /> {formatDate(post.date)}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text2)" }}>
                <User size={12} /> {post.author}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: "var(--bg2)", padding: "clamp(20px, 3vw, 32px) clamp(16px, 4vw, 48px)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {content ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="blog-prose"
              style={{
                textAlign: "justify",
                lineHeight: 1.8,
                fontSize: "16px",
                color: "var(--text)"
              }}
            >
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p style={{ textAlign: "justify", marginBottom: "1.5em", lineHeight: 1.8 }}>
                      {children}
                    </p>
                  ),
                  img: ({ src, alt }) => (
                    <div style={{ 
                      width: "100%", 
                      display: "flex", 
                      justifyContent: "center",
                      margin: "2em 0"
                    }}>
                      <img 
                        src={src} 
                        alt={alt} 
                        style={{ 
                          maxWidth: "90%", 
                          width: "auto",
                          height: "auto",
                          borderRadius: "12px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
                        }} 
                      />
                    </div>
                  ),
                  h1: ({ children }) => (
                    <h1 style={{ textAlign: "center", margin: "1.5em 0 0.8em", fontSize: "2em", fontWeight: 700 }}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 style={{ textAlign: "center", margin: "1.3em 0 0.7em", fontSize: "1.6em", fontWeight: 600 }}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 style={{ textAlign: "center", margin: "1.2em 0 0.6em", fontSize: "1.3em", fontWeight: 600 }}>
                      {children}
                    </h3>
                  ),
                  ul: ({ children }) => (
                    <ul style={{ paddingLeft: "2em", marginBottom: "1.5em" }}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol style={{ paddingLeft: "2em", marginBottom: "1.5em" }}>
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li style={{ marginBottom: "0.5em", textAlign: "justify" }}>
                      {children}
                    </li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote style={{ 
                      borderLeft: "4px solid var(--green)", 
                      paddingLeft: "1em", 
                      margin: "1.5em 0",
                      fontStyle: "italic",
                      color: "var(--text2)"
                    }}>
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </motion.div>
          ) : (
            <p style={{ color: "var(--text2)", textAlign: "center", padding: "60px 0" }}>Content not found.</p>
          )}
        </div>
      </section>

      {/* Prev / Next navigation */}
      {(prevPost || nextPost) && (
        <section style={{ background: "var(--bg)", padding: "clamp(20px, 3vw, 32px) clamp(16px, 4vw, 48px)" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {prevPost ? (
              <Link to={`/blog/${prevPost.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "10px", padding: "20px", transition: "border-color 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--green)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text2)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
                    <ArrowLeft size={10} /> Previous
                  </p>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", lineHeight: 1.4 }}>{prevPost.title}</p>
                </div>
              </Link>
            ) : <div />}

            {nextPost ? (
              <Link to={`/blog/${nextPost.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "10px", padding: "20px", textAlign: "right", transition: "border-color 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--green)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text2)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px", justifyContent: "flex-end" }}>
                    Next <ArrowRight size={10} />
                  </p>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", lineHeight: 1.4 }}>{nextPost.title}</p>
                </div>
              </Link>
            ) : <div />}
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
