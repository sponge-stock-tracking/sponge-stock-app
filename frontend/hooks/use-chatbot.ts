'use client'

import { useState, useCallback } from 'react'
import { GeminiClient, ChatMessage } from '../lib/gemini-client'
import { buildAppContext, getSystemContext } from '../lib/chat-context'

export interface UseChatbotReturn {
    messages: ChatMessage[]
    isLoading: boolean
    error: string | null
    sendMessage: (message: string, includeContext?: boolean) => Promise<void>
    clearChat: () => void
}

export function useChatbot(): UseChatbotReturn {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [client] = useState(() => {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
        if (!apiKey) {
            console.error('GEMINI_API_KEY not found in environment variables')
            return null
        }
        console.log('useChatbot: API key found, initializing client')
        const geminiClient = new GeminiClient(apiKey)
        geminiClient.setSystemContext(getSystemContext())
        return geminiClient
    })

    const sendMessage = useCallback(async (message: string, includeContext = false) => {
        if (!client) {
            setError('Chatbot yapılandırılmamış. API key eksik.')
            return
        }

        if (!message.trim()) return

        setIsLoading(true)
        setError(null)

        try {
            // Context al (iste)
            const appContext = includeContext ? await buildAppContext() : undefined

            // Mesaj gönder
            const response = await client.sendMessage(message, appContext)

            // State'i güncelle
            setMessages(client.getHistory())
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Bir hata oluştu'
            setError(errorMessage)
            console.error('Chat error:', err)
        } finally {
            setIsLoading(false)
        }
    }, [client])

    const clearChat = useCallback(() => {
        if (client) {
            client.clearHistory()
            setMessages([])
            setError(null)
        }
    }, [client])

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearChat
    }
}
