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
    <Card className="border-red-200 dark:border-red-900">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <CardTitle className="text-red-600">Kritik Stok Uyarısı</CardTitle>
        </div>
        <CardDescription>
          Kritik seviyenin altındaki ürünler - Acil sipariş gerekebilir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sünger Adı</TableHead>
              <TableHead className="text-right">Mevcut Stok</TableHead>
              <TableHead className="text-right">Kritik Seviye</TableHead>
              <TableHead className="text-right">Durum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {criticalStocks.map((stock, index) => {
              const shortage = stock.critical_stock - stock.available_stock
              const percentageBelowCritical = 
                ((stock.critical_stock - stock.available_stock) / stock.critical_stock) * 100

              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{stock.name}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-red-600 font-semibold">
                      {stock.available_stock.toLocaleString("tr-TR")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
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
