import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fuel Last Mile MVP",
  description: "Walking skeleton for fuel accountability",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Fuel Last Mile MVP</h1>
          <nav>
            <Link href="/events/new">New Event</Link> | <Link href="/events">Timeline</Link> |{" "}
            <Link href="/summary">Summary</Link>
          </nav>
          <hr />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
