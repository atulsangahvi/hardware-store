# ======= app/layout.tsx =======
export const metadata = {
title: 'HardwareHub',
description: 'Demo storefront running on Next.js + Tailwind',
};
import './globals.css';


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body className="min-h-screen antialiased bg-slate-50">
{children}
</body>
</html>
);
}

