import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { format } from "date-fns"

// Define types for jsPDF with autotable
interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable: {
        finalY: number
    }
}

interface ReportData {
    title: string
    period: string
    date: string
    summary: {
        label: string
        value: string
        color?: string
    }[]
    tableHeaders: string[]
    tableData: any[][]
}

// Helper to handle Turkish characters by transliterating to closest ASCII
const turkishToAscii = (text: string): string => {
    const map: { [key: string]: string } = {
        'ç': 'c', 'Ç': 'C',
        'ğ': 'g', 'Ğ': 'G',
        'ı': 'i', 'I': 'I',
        'İ': 'I',
        'ö': 'o', 'Ö': 'O',
        'ş': 's', 'Ş': 'S',
        'ü': 'u', 'Ü': 'U'
    }
    return text.replace(/[çÇğĞıİöÖşŞüÜ]/g, char => map[char] || char)
}

export const generatePDF = async (data: ReportData) => {
    const doc = new jsPDF() as jsPDFWithAutoTable

    // Use standard helvetica font which supports Turkish characters
    doc.setFont("helvetica")

    // Header - Dark blue background
    doc.setFillColor(2, 16, 36)
    doc.rect(0, 0, 210, 40, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text(turkishToAscii("İYS SÜNGER"), 15, 20)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(turkishToAscii("Stok Raporu"), 15, 30)

    doc.text(turkishToAscii(data.date), 195, 20, { align: "right" })
    doc.text(turkishToAscii(data.period), 195, 30, { align: "right" })

    let yPos = 55

    // Summary Cards
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.text(turkishToAscii("Özet Bilgiler"), 15, yPos)
    yPos += 10

    const cardWidth = 45
    const cardHeight = 25
    const gap = 5

    data.summary.forEach((item, index) => {
        const x = 15 + index * (cardWidth + gap)
        if (x + cardWidth > 200) return

        // Card styling
        doc.setDrawColor(200, 200, 200)
        doc.setFillColor(248, 250, 252) // slate-50
        doc.roundedRect(x, yPos, cardWidth, cardHeight, 2, 2, "FD")

        // Label
        doc.setFontSize(9)
        doc.setTextColor(100, 116, 139) // slate-500
        doc.text(turkishToAscii(item.label), x + 4, yPos + 8)

        // Value
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")

        // Color mapping
        if (item.color === "green") doc.setTextColor(22, 163, 74)
        else if (item.color === "red") doc.setTextColor(220, 38, 38)
        else if (item.color === "blue") doc.setTextColor(37, 99, 235)
        else doc.setTextColor(15, 23, 42) // slate-900

        doc.text(turkishToAscii(item.value), x + 4, yPos + 18)
    })

    yPos += cardHeight + 15

    // Detailed Data Table
    doc.setTextColor(15, 23, 42)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(turkishToAscii("Detaylı Hareketler"), 15, yPos)
    yPos += 5

    autoTable(doc, {
        startY: yPos,
        head: [data.tableHeaders.map(h => turkishToAscii(h))],
        body: data.tableData.map(row => row.map(cell => turkishToAscii(String(cell)))),
        theme: 'grid',
        headStyles: {
            fillColor: [2, 16, 36],
            textColor: [255, 255, 255],
            font: "helvetica",
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            font: "helvetica",
            fontSize: 9,
            textColor: [51, 65, 85], // slate-700
            cellPadding: 3
        },
        columnStyles: {
            0: { halign: 'left' },    // Tarih
            1: { halign: 'right' },   // Giriş
            2: { halign: 'right' },   // Çıkış
            3: { halign: 'right', fontStyle: 'bold' } // Net
        },
        alternateRowStyles: {
            fillColor: [241, 245, 249] // slate-100
        },
        styles: {
            font: "helvetica" // Ensure font is applied to table
        }
    })

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(148, 163, 184) // slate-400
        doc.setFont("Roboto", "normal")
        doc.text(
            turkishToAscii(`Sayfa ${i} / ${pageCount} - İYS Sünger ve Malzemecilik - ${format(new Date(), "dd.MM.yyyy HH:mm")}`),
            105,
            290,
            { align: "center" }
        )
    }

    // Save the PDF
    doc.save(`iys-sunger-rapor-${format(new Date(), "yyyy-MM-dd")}.pdf`)
}
