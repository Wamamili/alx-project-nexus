// app/layout.jsx
import '../styles/globals.css';
import Header from  "../components/layout/Header";
import Footer from "../components/layout/Footer";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: {
    default: 'ByteMtaani Electronics Store',
    template: 'ByteMtaani Electronics Store | %s',
  },
  description:
    'Shop premium electronics at ByteMtaani - gaming controllers, DSLR cameras, laptops & more. Free delivery, quality warranty, up to 50% off sales.',
  keywords:
    'electronics, gaming controllers, DSLR cameras, laptops, desktop computers, xbox controller, gaming accessories, tech store',
  openGraph: {
    type: 'website',
    title: {
      default: 'ByteMtaani Electronics Store',
      template: 'ByteMtaani Electronics Store | %s',
    },
    description:
      'Discover premium electronics with unbeatable prices. Shop gaming gear, cameras, computers with free delivery and warranty protection.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Header />

        <main className="min-h-screen">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}