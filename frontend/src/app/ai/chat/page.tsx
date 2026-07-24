"use client"

import { useState } from "react"
import { 
  Card, CardContent, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Bot, Send, User, Sparkles, MessageSquare, Plus, Clock
} from "lucide-react"

// Mock Chat History
const chatHistory = [
  {
    role: "user",
    content: "Tolong analisis penjualan bulan ini dan beritahu barang apa saja yang hampir habis di Gudang C.",
    time: "10:30 AM"
  },
  {
    role: "ai",
    content: "Berdasarkan data penjualan 30 hari terakhir, omzet Anda naik 22.4% mencapai Rp 45.800.000.\n\nNamun, ada masalah kritis di **Gudang C (Retail)**:\n1. **Gula Aren Cair 1L** hanya tersisa 2 pcs (batas minimum 10 pcs).\n2. **Kopi Arabica Premium** mengalami perputaran sangat cepat di sana. Saat ini sisa 80 pcs, diprediksi akan habis dalam 4 hari jika tren penjualan konstan.\n\n*Rekomendasi:* Segera lakukan Transfer Gudang dari Gudang A (Pusat) sebanyak 50 pcs Gula Aren Cair ke Gudang C siang ini.",
    time: "10:30 AM"
  },
  {
    role: "user",
    content: "Buatkan draft surat perintah transfer gudang untuk itu.",
    time: "10:32 AM"
  },
  {
    role: "ai",
    content: "Tentu, ini draf perintah transfer:\n\n**SURAT PERINTAH TRANSFER STOK (STS-2607-001)**\n**Dari:** Gudang A (Pusat)\n**Ke:** Gudang C (Retail)\n**Item:** Gula Aren Cair 1L\n**Jumlah:** 50 pcs\n**Prioritas:** TINGGI\n\n*Silakan klik tombol 'Buat Transaksi Transfer' di modul Inventaris untuk mengeksekusinya.*",
    time: "10:32 AM"
  }
]

export default function AiChat() {
  const [message, setMessage] = useState("")

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6 animate-in fade-in duration-500">
      
      {/* SIDEBAR HISTORY */}
      <Card className="w-full lg:w-80 flex flex-col border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shrink-0">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <Button className="w-full justify-start gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400 border-none shadow-none">
            <Plus className="w-4 h-4" /> Obrolan Baru
          </Button>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-2">Hari Ini</p>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start font-normal px-2 py-1.5 h-auto bg-slate-50 dark:bg-slate-800">
                    <MessageSquare className="w-4 h-4 mr-2 text-indigo-500" />
                    <span className="truncate text-sm">Analisis Stok Gudang C</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start font-normal px-2 py-1.5 h-auto text-slate-600 dark:text-slate-400">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    <span className="truncate text-sm">Review Performa Admin</span>
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-2">Kemarin</p>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start font-normal px-2 py-1.5 h-auto text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="truncate text-sm">Laporan Pajak Q2</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start font-normal px-2 py-1.5 h-auto text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="truncate text-sm">Tren Penjualan Kopi Susu</span>
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* CHAT AREA */}
      <Card className="flex-1 flex flex-col border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
        
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between py-4 bg-slate-50/50 dark:bg-[#0F172A]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Avario AI Assistant</CardTitle>
              <p className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online & Siap Membantu
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-900/30">
            <Sparkles className="w-4 h-4" /> Generate Report
          </Button>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full px-4 sm:px-6 py-6">
            <div className="space-y-6 pb-4">
              {chatHistory.map((chat, idx) => (
                <div key={idx} className={`flex gap-4 ${chat.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border shadow-sm ${
                    chat.role === 'ai' 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-transparent text-white' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {chat.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  
                  {/* Bubble */}
                  <div className={`flex flex-col gap-1 max-w-[85%] lg:max-w-[75%] ${chat.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{chat.role === 'ai' ? 'Avario AI' : 'Anda'}</span>
                      <span className="text-[10px] text-slate-400">{chat.time}</span>
                    </div>
                    
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                      chat.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                    }`}>
                      {chat.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/50">
          <form className="relative w-full flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); setMessage(""); }}>
            <Input 
              placeholder="Tanya AI untuk menganalisis performa toko, prediksi stok, atau cek kas masuk..." 
              className="pr-12 py-6 rounded-xl border-slate-200 dark:border-slate-700 shadow-sm focus-visible:ring-indigo-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute right-2 h-9 w-9 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-transform hover:scale-105"
              disabled={!message.trim()}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
