import { getChatbotContext } from '../api/chatbot'
import type { StockSummaryItem, CriticalStock } from './types'

export interface AppContext {
    stockSummary?: any
    criticalStocks?: any
    recentActivity?: any
}

/**
 * Backend API'lerden chatbot için context oluştur (Ham veri nesneleri olarak)
 */
export async function buildAppContext(): Promise<AppContext> {
    try {
        const data = await getChatbotContext().catch(err => {
            console.error('getChatbotContext failed:', err)
            return null
        })

        if (!data) return {}

        console.log('buildAppContext: Fetched data from backend', {
            summaryLength: data.stockSummary?.length,
            criticalLength: data.criticalStocks?.length
        })

        const context: AppContext = {}

        if (data.stockSummary && Array.isArray(data.stockSummary) && data.stockSummary.length > 0) {
            context.stockSummary = {
                total_items: data.stockSummary.length,
                total_stock: data.stockSummary.reduce((sum: number, s: StockSummaryItem) => sum + s.current_stock, 0),
                critical_count: data.stockSummary.filter((s: StockSummaryItem) => s.current_stock <= s.critical_stock).length,
                items: data.stockSummary.map((s: StockSummaryItem) => ({
                    name: s.name,
                    stock: s.current_stock,
                    critical: s.critical_stock
                }))
            }
        }

        if (data.criticalStocks && Array.isArray(data.criticalStocks) && data.criticalStocks.length > 0) {
            context.criticalStocks = data.criticalStocks.map((c: any) => ({
                name: c.name,
                available: c.available_stock,
                critical: c.critical_stock
            }))
        }

        if (data.recentActivity) {
            context.recentActivity = data.recentActivity
        }

        return context
    } catch (error) {
        console.error('Error building app context:', error)
        return {}
    }
}

/**
 * Sistem context'i oluştur (Artık GeminiClient içinde sistem talimatı olarak tanımlı)
 */
export function getSystemContext(): string {
    return `
Sen Sponge Stock Takip Uygulaması için geliştirilmiş akıllı bir yapay zeka asistanısın.
Adın: "Sponge Assistant".
Görevin: Kullanıcıya stok durumu, kritik ürünler ve depo hareketleri hakkında yardımcı olmak.

KURALLAR:
1. **Ton ve Üslup**: Profesyonel, yardımsever ve öz yanitlar ver. Gereksiz uzun cümlelerden kaçın.
2. **Format**: Yanıtlarını okunabilir kılmak için Markdown kullan.
   - Listeler için madde işaretleri kullan.
   - Veri tabloları için Markdown tablolarını kullan (özellikle stok listeleri için).
   - Önemli sayıları ve ürün adlarını **kalın** yaz.
3. **Veri Kullanımı**:
   - Sana "Uygulama Context'i" içinde stok verileri sağlanacak.
   - "Mevcut Stok Durumu": Genel stok varlığını gösterir.
   - "Kritik Stoklar": Acil sipariş verilmesi gereken, stoğu 'critical' seviyenin altındaki ürünlerdir. Bunları her zaman vurgula.
   - "Son Aktiviteler": Depoya son giren/çıkan ürünleri gösterir.
4. **Bilinmeyen Durumlar**: Eğer sağlanan veride bir bilgi yoksa, bunu dürüstçe "Bu veri şu an sistemde mevcut değil" şeklinde belirt. Asla tahmin yürütme.

Örnek Yanıt Formatı:
"Mevcut stok durumunuza göre **3 ürün** kritik seviyenin altında:
| Ürün Adı | Stok | Kritik Eşik |
|----------|------|-------------|
| 18 DNS Sert | **5** | 10 |
...
Lütfen bu ürünler için sipariş oluşturmayı düşünün."
`;
}
