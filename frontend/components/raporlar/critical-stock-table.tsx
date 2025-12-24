import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CriticalStock } from "@/lib/types"
import { AlertTriangle } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface CriticalStockTableProps {
  criticalStocks: CriticalStock[]
}

export function CriticalStockTable({ criticalStocks }: CriticalStockTableProps) {
  if (criticalStocks.length === 0) {
    return null
  }

  return (
    <Card className="bg-slate-950/30 border-red-900/30 shadow-inner">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <CardTitle className="text-red-400">Kritik Stok Uyarısı</CardTitle>
        </div>
        <CardDescription className="text-slate-400">
          Kritik seviyenin altındaki ürünler - Acil sipariş gerekebilir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-red-950/20 hover:bg-red-950/20">
            <TableRow className="border-red-900/20 hover:bg-transparent">
              <TableHead className="text-slate-300">Sünger Adı</TableHead>
              <TableHead className="text-right text-slate-300">Mevcut Stok</TableHead>
              <TableHead className="text-right text-slate-300">Kritik Seviye</TableHead>
              <TableHead className="text-right text-slate-300">Durum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {criticalStocks.map((stock, index) => {
              const shortage = stock.critical_stock - stock.available_stock
              const percentageBelowCritical =
                ((stock.critical_stock - stock.available_stock) / stock.critical_stock) * 100

              return (
                <TableRow key={index} className="border-slate-800 hover:bg-red-900/10">
                  <TableCell className="font-medium text-slate-200">{stock.name}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-red-400 font-bold text-lg">
                      {stock.available_stock.toLocaleString("tr-TR")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-slate-400">
                    {stock.critical_stock.toLocaleString("tr-TR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="destructive" className="whitespace-nowrap">
                        {shortage.toLocaleString("tr-TR")} eksik
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        %{percentageBelowCritical.toFixed(0)} altında
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
