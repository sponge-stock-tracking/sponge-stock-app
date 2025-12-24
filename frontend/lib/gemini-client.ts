import { GoogleGenerativeAI } from '@google/generative-ai'

export interface ChatMessage {
    role: 'user' | 'model'
    content: string
    timestamp: Date
}

export interface AppContext {
    stockSummary?: string
    criticalStocks?: string
    recentActivity?: string
}

export class GeminiClient {
    private genAI: GoogleGenerativeAI
    private model: any
    private chatHistory: ChatMessage[] = []
    private systemContext: string = ''

    constructor(apiKey: string) {
        console.log('GeminiClient: Initializing with model gemini-2.5-flash-lite')
        this.genAI = new GoogleGenerativeAI(apiKey)
        // Using a confirmed available model from debug-models.js
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
    }

    /**
     * Mesaj gönder ve yanıt al
     */
    async sendMessage(message: string, appContext?: AppContext): Promise<string> {
        try {
            // Kullanıcı mesajını history'e ekle
            this.chatHistory.push({
                role: 'user',
                content: message,
                timestamp: new Date()
            })

            // Context oluştur
            const contextPrompt = this.buildContextPrompt(appContext)

            // Son 10 mesajı al (mevcut mesaj hariç)
            const history = this.chatHistory.slice(0, -1).slice(-10)

            // Gemini'ye gönder
            const chat = this.model.startChat({
                history: history.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                })),
                generationConfig: {
                    maxOutputTokens: 2000,
                    temperature: 0.7,
                },
            })

            const fullPrompt = contextPrompt
                ? `${contextPrompt}\n\nKullanıcı: ${message}`
                : message

            console.log('GeminiClient: Sending message. Prompt length:', fullPrompt.length, 'History size:', history.length)
            const result = await chat.sendMessage(fullPrompt)
            const response = await result.response.text()

            // AI yanıtını history'e ekle
            this.chatHistory.push({
                role: 'model',
                content: response,
                timestamp: new Date()
            })

            return response
        } catch (error) {
            console.error('Gemini API Error:', error)
            throw new Error('Mesaj gönderilemedi. Lütfen tekrar deneyin.')
        }
    }

    /**
     * App context'ten prompt oluştur
     */
    private buildContextPrompt(appContext?: AppContext): string {
        if (!appContext) return this.systemContext

        let context = this.systemContext

        if (appContext.stockSummary) {
            context += `\n\nMevcut Stok Durumu:\n${typeof appContext.stockSummary === 'string' ? appContext.stockSummary : JSON.stringify(appContext.stockSummary, null, 2)}`
        }

        if (appContext.criticalStocks) {
            context += `\n\nKritik Stoklar:\n${typeof appContext.criticalStocks === 'string' ? appContext.criticalStocks : JSON.stringify(appContext.criticalStocks, null, 2)}`
        }

        if (appContext.recentActivity) {
            context += `\n\nSon Aktiviteler:\n${typeof appContext.recentActivity === 'string' ? appContext.recentActivity : JSON.stringify(appContext.recentActivity, null, 2)}`
        }

        return context
    }

    /**
     * Sistem context'i ayarla (uygulama hakkında genel bilgi)
     */
    setSystemContext(context: string) {
        this.systemContext = context
    }

    /**
     * Konuşma geçmişini al
     */
    getHistory(): ChatMessage[] {
        return this.chatHistory
    }

    /**
     * Konuşma geçmişini temizle
     */
    clearHistory() {
        this.chatHistory = []
    }

    /**
     * History'den mesaj sayısı al
     */
    getMessageCount(): number {
        return this.chatHistory.length
    }
}
