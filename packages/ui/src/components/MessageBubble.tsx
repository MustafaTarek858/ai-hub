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
      padding: 'var(--space-2) 0',
      gap: 'var(--space-1)',
    }}>
      {/* Role label */}
      <span style={{
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-bold)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: isUser ? 'var(--color-accent)' : 'var(--color-text-muted)',
        paddingLeft: isUser ? '0' : '4px',
        paddingRight: isUser ? '4px' : '0',
      }}>
        {isUser ? 'You' : 'AI'}
      </span>

      <div style={{
        maxWidth: '82%',
        padding: isUser ? 'var(--space-3) var(--space-4)' : '0 4px',
        borderRadius: isUser ? 'var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg)' : 'var(--radius-md)',
        background: isUser ? 'var(--color-accent)' : 'transparent',
        color: isUser ? '#fff' : 'var(--color-text-primary)',
        fontSize: 'var(--text-base)',
        lineHeight: 'var(--leading-normal)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        fontFamily: isUser ? 'var(--font-ui)' : 'var(--font-ui)',
        boxShadow: isUser ? '0 1px 4px rgba(212,97,60,0.18)' : 'none',
      }}>
        {content || (
          <span style={{ opacity: 0.4, fontStyle: 'italic' }}>Thinking…</span>
        )}
      </div>
    </div>
  );
}
