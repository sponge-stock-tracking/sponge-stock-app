'use client'

import { ChatMessage } from '../../lib/gemini-client'
import { Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useTypewriter } from '../../hooks/use-typewriter'

interface MessageBubbleProps {
    message: ChatMessage
    isLatest?: boolean
}

export function MessageBubble({ message, isLatest = false }: MessageBubbleProps) {
    const isUser = message.role === 'user'

    // Only animate if it's the latest message and it's from the bot
    const shouldAnimate = isLatest && !isUser
    const { displayedText, isComplete } = useTypewriter(message.content, 20, shouldAnimate)

    return (
        <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(193,232,255,0.2)] text-[var(--bg-very-light)] border border-[rgba(193,232,255,0.1)]">
                    <Bot className="h-4 w-4" />
                </div>
            )}

            <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md backdrop-blur-sm ${isUser
                    ? 'bg-[rgba(193,232,255,0.25)] border border-[rgba(193,232,255,0.2)] rounded-tr-sm'
                    : 'bg-[rgba(84,131,179,0.25)] border border-[rgba(84,131,179,0.2)] rounded-tl-sm'
                    }`}
            >
                <div className="text-sm prose prose-invert prose-p:leading-relaxed prose-pre:max-w-[300px] prose-pre:overflow-x-auto max-w-none break-words text-[var(--text-main)] overflow-x-auto">
                    <ReactMarkdown>{displayedText}</ReactMarkdown>
                    {/* Blinking cursor while typing */}
                    {shouldAnimate && !isComplete && (
                        <span className="inline-block w-1.5 h-3 ml-0.5 align-middle bg-[var(--text-main)] animate-pulse" />
                    )}
                </div>
                <div className={`text-[10px] mt-1.5 opacity-60 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    {message.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

            {isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(193,232,255,0.2)] text-[var(--bg-very-light)] border border-[rgba(193,232,255,0.1)]">
                    <User className="h-4 w-4" />
                </div>
            )}
        </div>
    )
}
