import { Geist, Geist_Mono } from "next/font/google";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Providers from "@/components/Providers"; // Import client component
import Navbar from "@/components/layout/Navbar";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "GitGood",
  description:
    "A platform for uploading or exploring coding interview style questions that anyone can tackle.",
  openGraph: {
    title: "GitGood",
    description:
      "A platform for uploading or exploring coding interview style questions that anyone can tackle.",
    url: "https://gitgood.cc",
    type: "website",
    site_name: "GitGood",
    images: [
      {
        url: "https://gitgood.cc/featured.jpg",
        alt: "A cool looking laptop we thought looked cool",
        width: 689,
        height: 360,
      },
    ],
  },
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <title>GitGood</title>
      </head>
      <body className={`antialiased`}>
        <Providers session={session}>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
