import React from "react";
import Link from "next/link";

const tabs = ["overview","runs","jobs","skills","evidence","issues","environments","settings","evals"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>
      <h1>APERTURE Mission Control</h1>
      <nav>{tabs.map((t) => <Link key={t} href={`/${t}`} style={{ marginRight: 12 }}>{t}</Link>)}</nav>
      <hr />
      {children}
    </body></html>
  );
}
