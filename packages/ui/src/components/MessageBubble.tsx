import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      padding: 'var(--space-3) 0',
      gap: '6px',
    }}>

      {/* Avatar + Label row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}>
        {/* Avatar circle */}
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: 'var(--radius-full)',
          background: isUser ? 'var(--color-accent)' : 'var(--color-bg-elevated)',
          border: isUser ? 'none' : '1px solid var(--color-border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {isUser ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="var(--color-accent)"/>
            </svg>
          )}
        </div>

        {/* Name label */}
        <span style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-bold)',
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          color: isUser ? 'var(--color-accent)' : 'var(--color-text-muted)',
        }}>
          {isUser ? 'You' : 'AI Assistant'}
        </span>
      </div>

      {/* Message bubble */}
      <div style={{
        maxWidth: '78%',
        marginLeft: isUser ? '0' : '36px',
        marginRight: isUser ? '36px' : '0',
      }}>
        {isUser ? (
          /* User bubble — terracotta filled */
          <div style={{
            background: 'var(--color-accent)',
            color: '#fff',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: '18px 18px 4px 18px',
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--leading-normal)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            boxShadow: '0 2px 8px rgba(212, 97, 60, 0.2)',
          }}>
            {content}
          </div>
        ) : (
          /* AI bubble — warm surface with left accent border */
          <div style={{
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-subtle)',
            borderLeft: '3px solid var(--color-accent)',
            borderRadius: '4px 18px 18px 18px',
            padding: 'var(--space-4)',
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--leading-normal)',
            wordBreak: 'break-word',
            color: 'var(--color-text-primary)',
            boxShadow: '0 1px 4px rgba(28, 23, 19, 0.06)',
          }}>
            {!content ? (
              <span style={{ opacity: 0.4, fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>
                Thinking…
              </span>
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p style={{ margin: '0 0 0.8em 0' }}>{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong style={{ fontWeight: 'var(--font-heavy)', color: 'var(--color-text-primary)' }}>{children}</strong>
                  ),
                  ul: ({ children }) => (
                    <ul style={{ paddingLeft: '1.4em', margin: '0 0 0.8em 0' }}>{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol style={{ paddingLeft: '1.4em', margin: '0 0 0.8em 0' }}>{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li style={{ marginBottom: '0.3em' }}>{children}</li>
                  ),
                  code: ({ children, className }) => {
                    const isBlock = !!className;
                    return isBlock ? (
                      <pre style={{
                        background: 'var(--color-bg-elevated)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-3) var(--space-4)',
                        overflowX: 'auto',
                        margin: '0.8em 0',
                        fontFamily: 'var(--font-code)',
                        fontSize: 'var(--text-sm)',
                      }}>
                        <code>{children}</code>
                      </pre>
                    ) : (
                      <code style={{
                        fontFamily: 'var(--font-code)',
                        fontSize: '0.88em',
                        background: 'var(--color-bg-elevated)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        color: 'var(--color-accent)',
                      }}>{children}</code>
                    );
                  },
                  h1: ({ children }) => (
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', margin: '0 0 0.5em 0', letterSpacing: 'var(--tracking-tight)' }}>{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', margin: '0 0 0.4em 0' }}>{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-heavy)', margin: '0 0 0.4em 0' }}>{children}</h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote style={{
                      borderLeft: '2px solid var(--color-accent)',
                      paddingLeft: 'var(--space-3)',
                      margin: '0.8em 0',
                      color: 'var(--color-text-secondary)',
                      fontStyle: 'italic',
                    }}>{children}</blockquote>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
