import { forwardRef, TextareaHTMLAttributes } from 'react';

interface ChatInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSend?: (value: string) => void;
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ onSend, onKeyDown, style, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const value = (e.target as HTMLTextAreaElement).value.trim();
        if (value) onSend?.(value);
      }
      onKeyDown?.(e);
    };

    return (
      <textarea
        ref={ref}
        rows={1}
        aria-label="Message input"
        placeholder="Ask anything…"
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          minHeight: '44px',
          maxHeight: '180px',
          resize: 'none',
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-regular)',
          lineHeight: 'var(--leading-normal)',
          color: 'var(--color-text-primary)',
          background: 'var(--color-bg-input)',
          border: '1.5px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '10px var(--space-4)',
          outline: 'none',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          ...style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-accent)';
          e.target.style.boxShadow = '0 0 0 3px var(--color-accent-subtle)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--color-border-subtle)';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
    );
  }
);

ChatInput.displayName = 'ChatInput';
