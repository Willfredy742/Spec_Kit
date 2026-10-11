import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "mi-podcast",
  description: "Podcast episode list — explore and play episodes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
