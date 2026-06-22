import { useEffect, useRef, useState } from 'react';
import { ChatInput, MessageBubble, Spinner } from '@ai-hub/ui';
import { chatStream } from '@ai-hub/ai-core';
import type { Message } from '@ai-hub/ai-core';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY ?? '';

export function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (content: string) => {
    if (!content.trim() || streaming) return;
    if (inputRef.current) inputRef.current.value = '';

    const next: Message[] = [...messages, { role: 'user', content }];
    setMessages(next);
    setStreaming(true);

    let assistantContent = '';
    setMessages([...next, { role: 'assistant', content: '' }]);

    try {
      for await (const chunk of chatStream(next, API_KEY)) {
        assistantContent += chunk;
        setMessages([...next, { role: 'assistant', content: assistantContent }]);
      }
    } finally {
      setStreaming(false);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      background: 'var(--color-bg-base)',
    }}>

      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-8)',
        height: '60px',
        borderBottom: '1px solid var(--color-border-subtle)',
        background: 'var(--color-bg-base)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-text-primary)',
            letterSpacing: 'var(--tracking-tight)',
          }}>
            AI Chat
          </span>
          <span style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-regular)',
            color: 'var(--color-text-muted)',
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
          }}>
            via Groq
          </span>
        </div>

        {/* Model badge */}
        <div style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-accent)',
          background: 'var(--color-accent-subtle)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          fontWeight: 'var(--font-bold)',
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
        }}>
          Llama 3.3
        </div>
      </header>

      {/* Messages area */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          maxWidth: '720px',
          width: '100%',
          margin: '0 auto',
          padding: isEmpty ? '0' : 'var(--space-8) var(--space-6)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}>

          {/* Empty state */}
          {isEmpty && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-4)',
              padding: 'var(--space-12)',
              textAlign: 'center',
            }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-accent-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="var(--color-accent)"/>
                </svg>
              </div>
              <div>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-bold)',
                  color: 'var(--color-text-primary)',
                  letterSpacing: 'var(--tracking-tight)',
                  marginBottom: 'var(--space-2)',
                }}>
                  What's on your mind?
                </p>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-muted)',
                  lineHeight: 'var(--leading-normal)',
                }}>
                  Ask anything. I'm powered by Llama 3.3 via Groq.
                </p>
              </div>

              {/* Prompt suggestions */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-2)',
                justifyContent: 'center',
                marginTop: 'var(--space-2)',
              }}>
                {['Explain a concept', 'Write some code', 'Summarize text', 'Brainstorm ideas'].map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    style={{
                      background: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      padding: '6px 14px',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                      fontFamily: 'var(--font-ui)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-subtle)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
          ))}

          {streaming && messages[messages.length - 1]?.content === '' && (
            <div style={{ padding: 'var(--space-2) 0' }}>
              <Spinner size={18} />
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input bar */}
      <div style={{
        borderTop: '1px solid var(--color-border-subtle)',
        background: 'var(--color-bg-base)',
        padding: 'var(--space-4) var(--space-6)',
        flexShrink: 0,
      }}>
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          display: 'flex',
          gap: 'var(--space-3)',
          alignItems: 'flex-end',
        }}>
          <ChatInput
            ref={inputRef}
            onSend={send}
            disabled={streaming}
            style={{ flex: 1 }}
          />
          <SendButton onClick={() => {
            const val = inputRef.current?.value.trim() ?? '';
            if (val) send(val);
          }} loading={streaming} />
        </div>
        <p style={{
          textAlign: 'center',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-muted)',
          marginTop: 'var(--space-2)',
          letterSpacing: 'var(--tracking-wide)',
        }}>
          Press <kbd style={{ fontFamily: 'var(--font-code)', background: 'var(--color-bg-elevated)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>Enter</kbd> to send · <kbd style={{ fontFamily: 'var(--font-code)', background: 'var(--color-bg-elevated)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}

function SendButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      aria-label="Send message"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        borderRadius: 'var(--radius-md)',
        background: loading ? 'var(--color-accent-subtle)' : 'var(--color-accent)',
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'background 150ms ease, transform 100ms ease',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--color-accent-hover)'; }}
      onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--color-accent)'; }}
      onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.95)'; }}
      onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
    >
      {loading ? (
        <Spinner size={16} />
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M22 2L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}
