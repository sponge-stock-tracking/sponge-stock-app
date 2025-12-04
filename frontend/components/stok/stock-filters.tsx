"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface StockFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filterType: string
  onFilterChange: (value: string) => void
}

export function StockFilters({ searchTerm, onSearchChange, filterType, onFilterChange }: StockFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Label htmlFor="search" className="sr-only">
          Ara
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Sünger adı ile ara..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="w-full sm:w-48">
        <Label htmlFor="filter" className="sr-only">
          Filtrele
        </Label>
        <Select value={filterType} onValueChange={onFilterChange}>
          <SelectTrigger id="filter">
            <SelectValue placeholder="Tümü" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Stoklar</SelectItem>
            <SelectItem value="critical">Kritik Stoklar</SelectItem>
            <SelectItem value="normal">Normal Stoklar</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
