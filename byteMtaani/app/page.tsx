import { Metadata } from 'next';
import HomePage from './HomePage';


export const metadata: Metadata = {
    title: 'ByteMtoani Electronics Store - Premium Electronics & Gaming Gear',
    description: 'Shop premium electronics at ByteMtoani - gaming controllers, DSLR cameras, laptops & more. Free delivery, quality warranty, up to 50% off sales. Discover unbeatable prices on tech.',
    keywords: 'electronics store, gaming controllers, DSLR cameras, laptops, desktop computers, xbox controller, gaming accessories, tech store, Canon camera, JBL speakers, free delivery, warranty',

    openGraph: {
        title: 'ByteMtoani Electronics Store - Premium Electronics & Gaming Gear',
        description: 'Shop premium electronics at ByteMtoani - gaming controllers, DSLR cameras, laptops & more. Free delivery, quality warranty, up to 50% off sales. Discover unbeatable prices on tech.',
    }
}
export default function Home() {
    return <HomePage />;
}
