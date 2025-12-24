import api from './axios'

export interface ChatbotContext {
    stockSummary: any
    criticalStocks: any[]
    recentActivity: any
    error?: string
}

export async function getChatbotContext(): Promise<ChatbotContext> {
    const response = await api.get('/chatbot/context')
    return response.data
}
