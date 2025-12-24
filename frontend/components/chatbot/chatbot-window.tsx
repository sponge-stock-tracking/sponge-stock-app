'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, Send, Trash2, Database, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { useChatbot } from '../../hooks/use-chatbot'
import { MessageBubble } from './message-bubble'

interface ChatbotWindowProps {
    onClose: () => void
}

export function ChatbotWindow({ onClose }: ChatbotWindowProps) {
    const { messages, isLoading, error, sendMessage, clearChat } = useChatbot()
    const [input, setInput] = useState('')
    const [includeContext, setIncludeContext] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        await sendMessage(input, includeContext)
        setInput('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div
            className="fixed bottom-24 right-6 z-50 flex flex-col shadow-2xl animate-in slide-in-from-bottom-5 duration-300 w-[400px] h-[600px] max-h-[80vh] rounded-[var(--radius-lg)] bg-[#021024] border border-[rgba(193,232,255,0.2)] overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #052659, #021024)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[rgba(193,232,255,0.1)]">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[rgba(193,232,255,0.1)] border border-[rgba(193,232,255,0.05)]">
                        <Bot className="h-5 w-5 text-[var(--bg-very-light)]" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[var(--bg-very-light)] text-sm">AI Asistan</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="relative flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLoading ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${isLoading ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                            </span>
                            <p className="text-[10px] text-[var(--text-muted)]">
                                {isLoading ? 'Yanıt yazılıyor...' : 'Çevrimiçi'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-1">
                    {messages.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearChat}
                            className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400 transition-colors text-[var(--text-muted)]"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0 hover:bg-[rgba(193,232,255,0.1)] text-[var(--text-muted)]"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <ScrollAreaPrimitive.Root className="flex-1 overflow-hidden px-4 py-2 relative">
                <ScrollAreaPrimitive.Viewport ref={scrollRef} className="h-full w-full rounded-inherit">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8 px-4 opacity-0 animate-in fade-in zoom-in duration-500 delay-100">
                            <div className="w-16 h-16 rounded-full bg-[rgba(193,232,255,0.05)] flex items-center justify-center mb-4 border border-[rgba(193,232,255,0.1)]">
                                <Bot className="h-8 w-8 opacity-50 text-[var(--bg-very-light)]" />
                            </div>
                            <p className="text-sm font-medium text-[var(--bg-very-light)] mb-1">
                                Merhaba! Size nasıl yardımcı olabilirim?
                            </p>
                            <p className="text-xs text-[var(--text-muted)] max-w-[200px]">
                                Stok durumu, raporlar ve analizler hakkında sorularını bekliyorum.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 pb-4">
                            {messages.map((msg, idx) => (
                                <MessageBubble
                                    key={idx}
                                    message={msg}
                                    isLatest={idx === messages.length - 1}
                                />
                            ))}
                            {isLoading && (
                                <div className="flex gap-2 items-center text-xs text-[var(--text-muted)] pl-2 animate-pulse">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--bg-very-light)] animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--bg-very-light)] animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--bg-very-light)] animate-bounce" />
                                    </div>
                                    Yanıt oluşturuluyor...
                                </div>
                            )}
                        </div>
                    )}
                    {error && (
                        <div className="mt-2 p-3 rounded-lg text-xs bg-red-500/10 border border-red-500/20 text-red-400">
                            {error}
                        </div>
                    )}
                </ScrollAreaPrimitive.Viewport>

                {/* Modern styled scrollbar */}
                <ScrollAreaPrimitive.Scrollbar
                    orientation="vertical"
                    className="flex select-none touch-none p-0.5 bg-[rgba(193,232,255,0.02)] transition-colors duration-[160ms] ease-out hover:bg-[rgba(193,232,255,0.05)] data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2 mr-1 rounded-full my-2"
                >
                    <ScrollAreaPrimitive.Thumb className="flex-1 bg-[rgba(193,232,255,0.2)] rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px] hover:bg-[rgba(193,232,255,0.4)] transition-colors" />
                </ScrollAreaPrimitive.Scrollbar>
            </ScrollAreaPrimitive.Root>

            {/* Context Toggle */}
            <div className="px-4 py-1.5 bg-[rgba(2,16,36,0.3)] border-t border-[rgba(193,232,255,0.1)]">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIncludeContext(!includeContext)}
                    className={`
                        w-full justify-center gap-2 h-7 text-[10px] rounded-md transition-all
                        ${includeContext
                            ? 'bg-[rgba(52,211,153,0.15)] text-emerald-400 hover:bg-[rgba(52,211,153,0.25)] hover:text-emerald-300'
                            : 'bg-transparent text-[var(--text-muted)] hover:bg-[rgba(193,232,255,0.1)]'}
                    `}
                >
                    <Database className="h-3 w-3" />
                    <span>
                        {includeContext ? 'Stok verisi analiz ediliyor' : 'Stok verisi analizi kapalı'}
                    </span>
                </Button>
            </div>

            {/* Input */}
            <div className="p-4 pt-3 bg-[rgba(2,16,36,0.3)]">
                <div className="relative">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Mesajınızı yazın..."
                        className="resize-none min-h-[50px] pr-12 rounded-xl bg-[rgba(193,232,255,0.05)] border-[rgba(193,232,255,0.1)] focus:border-[var(--bg-soft)] focus:ring-[var(--bg-soft)] text-sm placeholder:text-[var(--text-muted)] text-[var(--text-main)] transition-all"
                        rows={2}
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        size="icon"
                        className="absolute right-2 bottom-2 h-8 w-8 rounded-lg bg-[var(--bg-soft)] hover:bg-[var(--bg-mid)] text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
                <div className="text-[10px] text-center mt-2 text-[var(--text-muted)] opacity-50">
                    Gemini AI tarafından desteklenmektedir
                </div>
            </div>
        </div>
    )
}
