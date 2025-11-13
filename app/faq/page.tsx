"use client"
import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const faqs = [
    {
        question: "Bagaimana cara melakukan pembelian produk?",
        answer: "Anda dapat memilih produk yang diinginkan, menambahkannya ke keranjang, lalu mengikuti proses checkout untuk menyelesaikan pembayaran.",
    },
    {
        question: "Apakah produk yang dibeli bisa dikembalikan?",
        answer: "Produk dapat dikembalikan sesuai dengan kebijakan retur kami, selama memenuhi syarat dan ketentuan yang berlaku.",
    },
    {
        question: "Apakah transaksi jual beli aman?",
        answer: "Kami menggunakan sistem pembayaran yang aman dan melindungi data pribadi Anda selama proses transaksi.",
    },
    {
        question: "Bagaimana jika terjadi masalah saat transaksi?",
        answer: "Silakan hubungi layanan pelanggan kami melalui email atau live chat untuk mendapatkan bantuan terkait masalah transaksi.",
    },
];

export default function Home() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (idx: number) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <main className="min-h-screen bg-background">
            <Header />

            <section className="py-16 px-4 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Pertanyaan yang Sering Diajukan</h2>
                    <p className="text-muted-foreground">Temukan jawaban atas pertanyaan umum tentang layanan kami</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border border-border rounded-lg bg-card">
                            <button
                                className="w-full px-6 py-4 text-left font-medium text-foreground hover:bg-muted focus:outline-none transition-colors"
                                onClick={() => handleToggle(idx)}
                                aria-expanded={openIndex === idx}
                            >
                                {faq.question}
                            </button>
                            {openIndex === idx && (
                                <div className="px-6 pb-4 text-muted-foreground">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </main>
    );
}
