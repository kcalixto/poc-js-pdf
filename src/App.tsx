import { useRef, useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { PdfTemplate } from './pdf/PdfTemplate'
import { defaultPdfData } from './pdf/mockData'

export default function App() {
  const templateRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    if (!templateRef.current) return
    setExporting(true)

    const pages = templateRef.current.querySelectorAll<HTMLElement>('.pdf-page')
    if (!pages.length) { setExporting(false); return }

    // unit: 'mm' avoids px/dpi ambiguity — each page fills exactly A4 (210×297 mm)
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2 })
      const imgData = canvas.toDataURL('image/png')
      if (i > 0) pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297)
    }

    window.open(pdf.output('bloburl'), '_blank')
    setExporting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-violet-800 tracking-tight mb-2">
          Poc JSPdf from HTML
        </h1>
        <p className="text-violet-500 text-lg">Generate a PDF from a hidden HTML element</p>
      </div>

      <button
        onClick={handleExport}
        disabled={exporting}
        className="px-10 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
      >
        {exporting ? 'Exporting…' : 'export'}
      </button>

      {/* Hidden PDF template — off-screen, captured page-by-page via html2canvas */}
      <PdfTemplate ref={templateRef} dados={defaultPdfData} />
    </div>
  )
}
