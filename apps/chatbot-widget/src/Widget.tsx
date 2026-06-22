import { useRef, useState } from 'react';
import { Button, ChatInput, MessageBubble, Spinner } from '@ai-hub/ui';
import { chatStream } from '@ai-hub/ai-core';
import type { Message } from '@ai-hub/ai-core';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY ?? '';

export function Widget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-accent)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(124,92,252,0.4)',
          zIndex: 1000,
          transition: 'transform 150ms ease',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/>
        </svg>
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '96px',
          right: '24px',
          width: '360px',
          height: '520px',
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          zIndex: 999,
        }}>
          <header style={{
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--color-border-subtle)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-text-primary)',
          }}>
            AI Assistant
          </header>

          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-3) var(--space-4)' }}>
            {messages.length === 0 && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center', marginTop: 'var(--space-8)' }}>
                Hi! How can I help you?
              </p>
            )}
            {messages.map((msg, i) => (
              <MessageBubble key={i} role={msg.role} content={msg.content} />
            ))}
            {streaming && messages[messages.length - 1]?.content === '' && <Spinner size={16} />}
          </div>

          <footer style={{
            padding: 'var(--space-3) var(--space-4)',
            borderTop: '1px solid var(--color-border-subtle)',
            display: 'flex',
            gap: 'var(--space-2)',
            alignItems: 'flex-end',
          }}>
            <ChatInput ref={inputRef} onSend={send} disabled={streaming} style={{ flex: 1, fontSize: 'var(--text-sm)' }} />
            <Button size="sm" onClick={() => { const v = inputRef.current?.value.trim() ?? ''; if (v) send(v); }} loading={streaming}>
              Send
            </Button>
          </footer>
        </div>
      )}
    </>
  );
}
