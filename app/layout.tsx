import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import SessionWrapper from "@/components/SessionWrapper";
import { PageTransition } from "@/components/PageTransition";
import { Toaster } from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Eryss",
    description: "Discover and share visual inspiration",
    keywords: [
        "art",
        "design",
        "photography",
        "visual",
        "inspiration",
        "gallery",
        "aesthetic",
    ],
    authors: [{ name: "CoffeeBoi", url: "https://github.com/coffeeboi0811" }],
    creator: "CoffeeBoi",
    publisher: "Eryss",
    openGraph: {
        title: "Eryss",
        description: "Discover and share visual inspiration",
        url: "https://eryss.vercel.app",
        siteName: "Eryss",
        images: [
            {
                url: "/og-default.png",
                width: 1200,
                height: 630,
                alt: "Eryss - Discover and share visual inspiration",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Eryss",
        description: "Discover and share visual inspiration",
        images: ["/og-default.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <SessionWrapper>
                        <Navbar />
                        <main className="pt-16 pb-16 md:pb-0">
                            <PageTransition>{children}</PageTransition>
                        </main>
                    </SessionWrapper>
                    <Toaster
                        position="bottom-center"
                        richColors
                        duration={1500}
                        className="z-50"
                    />
                </ThemeProvider>
            </body>
        </html>
    );
}
