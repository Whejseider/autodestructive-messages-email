import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Providers} from "./providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Mensajes Autodestructivos",
    description: "Comparte mensajes que se autodestruyen después de ser leídos",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased
          flex min-h-screen flex-col items-center justify-center p-8 
          bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}
        >
        <Providers>
            <main className="w-full max-w-2xl">
                {children}
            </main>
        </Providers>
        </body>
        </html>
    );
}