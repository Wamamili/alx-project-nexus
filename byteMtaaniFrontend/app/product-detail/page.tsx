//app/product-detail/page.tsx
import { Metadata } from 'next';
 import ProductDetailPage from'./ProductDetailPage';

export const metadata: Metadata = {
  title: 'Play Game Controller - Ksh 2,000 | Gaming Accessories',
  description: 'Buy the Play Game Controller for Ksh 2,000. Available in multiple colors and sizes with fast delivery. Premium gaming controller with excellent build quality and responsive controls.',
  keywords: 'play game controller, gaming controller, xbox controller, game pad, gaming accessories, electronics, gaming gear, controller ksh 2000',
  
  openGraph: {
    title: 'Play Game Controller - Ksh 2,000 | Gaming Accessories',
    description: 'Buy the Play Game Controller for Ksh 2,000. Available in multiple colors and sizes with fast delivery. Premium gaming controller with excellent build quality and responsive controls.',
  }
}

export default function Page() {
  return <ProductDetailPage />
}