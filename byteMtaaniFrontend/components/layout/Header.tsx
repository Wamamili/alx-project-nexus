import Link from 'next/link'
import SearchView from '../ui/SearchView';
import Button from '../ui/Button';

export default function Header() {
  return (
    <><header className="border-b  w-00%">
      <div className="container flex items-center justify-between px-6 py-4 bg-[#003F62] text-white shadow-md text-sm">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="ByteMtaani" className="h-10 mb-2" />
            </div>

            <div className="flex-1 max-w-xl mx-6">
              <SearchView placeholder="Search products, categories..." accent />
            </div>

            <div className="hidden md:block">
              <div className="flex items-center gap-3">
                <button className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-700 hover:text-byte-primary">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 12a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="1.5" /></svg>
                  Account
                </button>

                <Link href="/cart" className="relative">
                  <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3h2l.4 2M7 13h10l3-8H6.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-none text-white bg-red-500 rounded-full">2</span>
                </Link>

                <Button text="Sell" className="hidden md:inline-flex" />
              </div>
            </div>
          </div>
      <div>

      </div>

    </header><div className="flex items-center justify-between px-6 py-4 bg-white shadow-md text-sm  w-100%" >
        {/* Left section: Browse categories */}
        <div className="relative group">
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-md">
            Browse categories
          </button>
          <div className="absolute hidden group-hover:block bg-white shadow-lg mt-2 p-4">
            <ul className="space-y-2">
              <li><Link href="/categories/electronics">Electronics</Link></li>
              <li><Link href="/categories/accessories">Accessories</Link></li>
            </ul>
          </div>
        </div>

        {/* Center section: Main nav links */}
        <ul className="flex items-center gap-8 text-gray-700">
          <li><Link href="/" className="hover:text-[#003F62] transition-colors">Home</Link></li>
          <li><Link href="/products" className="hover:text-[#003F62] transition-colors">Products</Link></li>
          <li><Link href="/cart" className="hover:text-[#003F62] transition-colors">Cart</Link></li>
        </ul>

        {/* Right section: Highlight offer */}
        <div className="text-blue-600 font-medium">
          <Link href="/returns">30 Days Free Return</Link>
        </div>
      </div></>


  )
}




