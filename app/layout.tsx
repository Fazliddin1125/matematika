import React from "react"
import type { Metadata } from 'next'
import { Nunito, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Geist from 'geist' // Declaring the Geist variable

const _nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Matematika Mashq Sayti',
  description: 'Arifmetikani tez va oson o\'rganing - bolalar uchun matematika mashqlari',
 

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
