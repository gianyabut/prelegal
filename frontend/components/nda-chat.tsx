'use client';

import { useEffect, useRef, useState } from 'react';
import { ConfidentialityTermOption, MNDATermOption, NDAFormData, PartyInfo } from '@/types/nda';

interface AIResponse {
  message: string;
  purpose?: string | null;
  effectiveDate?: string | null;
  mndaTerm?: MNDATermOption | null;
  termOfConfidentiality?: ConfidentialityTermOption | null;
  governingLaw?: string | null;
  jurisdiction?: string | null;
  modifications?: string | null;
  party1?: Partial<PartyInfo> | null;
  party2?: Partial<PartyInfo> | null;
}

export type NDAFieldsPartial = {
  [K in keyof Omit<AIResponse, 'message'>]?: NonNullable<AIResponse[K]>;
};

const NDA_FIELD_KEYS = [
  'purpose', 'effectiveDate', 'mndaTerm', 'termOfConfidentiality',
  'governingLaw', 'jurisdiction', 'modifications', 'party1', 'party2',
] as const satisfies (keyof Omit<AIResponse, 'message'>)[];

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface NDAChatProps {
  fields: NDAFormData;
  onFieldsUpdate: (update: NDAFieldsPartial) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export function NDAChat({ fields, onFieldsUpdate }: NDAChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  async function callChat(history: ChatMessage[]) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, current_fields: fields }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: AIResponse = await res.json();

      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);

      const update = Object.fromEntries(
        NDA_FIELD_KEYS.filter((k) => data[k] != null).map((k) => [k, data[k]])
      ) as NDAFieldsPartial;

      if (Object.keys(update).length > 0) onFieldsUpdate(update);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    callChat([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    callChat(next);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div style={{ padding: '2rem 2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <p style={{
          fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.28em',
          textTransform: 'uppercase', color: 'rgba(201,149,74,0.5)', marginBottom: '0.5rem',
        }}>
          AI Assistant
        </p>
        <h2 className="font-display font-light" style={{ fontSize: '1.6rem', color: '#F0EAE0', lineHeight: 1.1 }}>
          Draft Your NDA
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#6A6258', marginTop: '0.375rem' }}>
          Chat with the AI — it will fill in your document as you go.
        </p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '0.875rem',
            }}
          >
            <div style={{
              maxWidth: '82%',
              padding: '0.625rem 0.875rem',
              borderRadius: '3px',
              fontSize: '0.845rem',
              lineHeight: 1.65,
              whiteSpace: 'pre-wrap',
              ...(msg.role === 'user'
                ? {
                    background: 'rgba(201,149,74,0.1)',
                    border: '1px solid rgba(201,149,74,0.18)',
                    color: '#F0EAE0',
                  }
                : {
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(240,234,224,0.82)',
                  }),
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.875rem' }}>
            <div style={{
              padding: '0.625rem 0.875rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '3px',
            }}>
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '1rem 2rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message… (Enter to send, Shift+Enter for new line)"
            disabled={loading}
            rows={3}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '3px',
              padding: '0.625rem 0.875rem',
              color: '#F0EAE0',
              fontSize: '0.845rem',
              fontFamily: 'var(--font-sans)',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.55,
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,149,74,0.35)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              padding: '0 1.125rem',
              height: '2.5rem',
              background: input.trim() && !loading ? '#753991' : 'rgba(117,57,145,0.25)',
              border: 'none',
              borderRadius: '3px',
              color: input.trim() && !loading ? '#F0EAE0' : 'rgba(240,234,224,0.3)',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: input.trim() && !loading ? 'pointer' : 'default',
              fontFamily: 'var(--font-sans)',
              transition: 'background 0.15s, color 0.15s',
              whiteSpace: 'nowrap',
              alignSelf: 'flex-end',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '1.1rem' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="typing-dot"
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: 'rgba(201,149,74,0.55)',
            display: 'inline-block',
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}
