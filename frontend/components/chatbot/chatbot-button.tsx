'use client'

import { MessageCircle, X } from 'lucide-react'
import { Button } from '../ui/button'
import { useState } from 'react'
import { ChatbotWindow } from './chatbot-window'

export function ChatbotButton() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="lg"
                    className="h-14 w-14 rounded-full p-0 shadow-2xl transition-all hover:scale-110 border-2 border-[rgba(193,232,255,0.3)] bg-gradient-to-br from-[#5483B3] to-[#052659] hover:brightness-110"
                >
                    {isOpen ? (
                        <X className="h-6 w-6 text-[var(--bg-very-light)]" />
                    ) : (
                        <MessageCircle className="h-6 w-6 text-[var(--bg-very-light)]" />
                    )}
                </Button>
            </div>

            {/* Chat Window */}
            {isOpen && <ChatbotWindow onClose={() => setIsOpen(false)} />}
        </>
    )
}
