import React, { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiSend, FiRefreshCw } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

const QUICK_PROMPTS = [
  'What cleaning services do you offer?',
  'I need my AC serviced',
  'Recommend services for my home',
  'How much does pest control cost?',
  'Book a deep cleaning',
  'Best beauty services?',
];

export default function AIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm **HomeBot**, your AI assistant for HomeServices.\n\nI can help you:\n• Find the right service for your needs\n• Get pricing information\n• Guide you through booking\n• Answer any questions\n\nWhat can I help you with today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg };
    const history = messages.filter(m => m.role !== 'system');
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await aiAPI.chat({
        message: msg,
        conversationHistory: history.slice(-10).map(m => ({ role: m.role, content: m.content }))
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again or browse our services directly. 🙏" }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const getRecommendations = async () => {
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: 'Give me personalized service recommendations' }]);
    try {
      const { data } = await aiAPI.getRecommendations({
        userPreferences: user?.address ? `Located in ${user.city || 'India'}` : '',
        previousBookings: [],
        searchHistory: []
      });
      setRecommendations(data);
      const msg = `Here are my personalized recommendations for you! 🌟\n\n${data.personalizedMessage}\n\n${data.recommendations?.map((r, i) => `**${i + 1}. ${r.service}** (${r.category})\n${r.reason} — *${r.estimatedPrice}*`).join('\n\n')}`;
      setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I couldn't generate recommendations right now. Try browsing our services!" }]);
    }
    setLoading(false);
  };

  const renderContent = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 Chat cleared. How can I help you?` }]);
    setRecommendations(null);
  };

  return (
    <div className="main-content" style={{ height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #A855F7 100%)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'white' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HiSparkles size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, fontFamily: 'var(--font-display)' }}>HomeBot AI Assistant</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Powered by Anthropic Claude</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={getRecommendations} disabled={loading} className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', gap: 6 }}>
            <HiSparkles size={14} /> Get Recommendations
          </button>
          <button onClick={clearChat} className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', gap: 6 }}>
            <FiRefreshCw size={14} /> Clear
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 800, width: '100%', margin: '0 auto' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeIn 0.3s ease' }}>
            {m.role === 'assistant' && (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <HiSparkles size={16} color="white" />
              </div>
            )}
            <div style={{
              maxWidth: '72%', padding: '14px 18px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user' ? 'var(--primary)' : 'white',
              color: m.role === 'user' ? 'white' : 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)', fontSize: 15, lineHeight: 1.6,
              border: m.role === 'assistant' ? '1px solid var(--border)' : 'none'
            }}
              dangerouslySetInnerHTML={{ __html: renderContent(m.content) }}
            />
            {m.role === 'user' && (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HiSparkles size={16} color="white" />
            </div>
            <div style={{ padding: '16px 20px', background: 'white', borderRadius: '18px 18px 18px 4px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div style={{ padding: '8px 16px', display: 'flex', gap: 8, overflowX: 'auto', maxWidth: 800, width: '100%', margin: '0 auto', scrollbarWidth: 'none' }}>
        {QUICK_PROMPTS.map(p => (
          <button key={p} onClick={() => sendMessage(p)} style={{
            padding: '8px 14px', borderRadius: 'var(--radius-full)', background: 'white', border: '1px solid var(--border)',
            whiteSpace: 'nowrap', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
            transition: 'all 0.2s', fontFamily: 'var(--font-body)'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >{p}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '16px', background: 'white', borderTop: '1px solid var(--border)', maxWidth: 800, width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask HomeBot anything about our services..."
            style={{ flex: 1, padding: '14px 18px', border: '2px solid var(--border)', borderRadius: 'var(--radius-full)', fontSize: 15, outline: 'none', fontFamily: 'var(--font-body)', transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', width: 52, height: 52, padding: 0, flexShrink: 0 }}>
            <FiSend size={18} />
          </button>
        </div>
      </div>

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }`}</style>
    </div>
  );
}
