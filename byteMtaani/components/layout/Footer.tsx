'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiSend } from 'react-icons/fi';

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = () => {
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <>
      {/* Newsletter Section */}
      <footer className="w-full bg-[#f3f7fb] text-gray-700 mt-12 p-6">
      <section className="w-full h-[300px] mt-[100px] flex items-center">
        <div className="w-full flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-md shadow mb-8">
            <h3 className=" textbg-[#171629] font-bold text-center text-2xl">Subscribe newsletter</h3>

          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={handleEmailChange}
                className="w-[250px] p-2 rounded-l-md border bg-yellow-500 text-white border-gray-300 focus:outline-none"
            />
            <button
              onClick={handleSubscribe}
              className="bg-yellow-500 p-2 rounded-r-md text-white"
            >
              <FiSend />
            </button>
          </div>

          <div className="text-xs text-gray-600 mt-4 md:mt-0 text-center md:text-left">
            <p>Call us 24/7: <br /> (+254) 700000000</p>
          </div>
        </div>
      </section>

      {/* Footer Body */}
      
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo + Contact */}
          <div>
            <img src="/logo.png" alt="ByteMtaani" className="h-10 mb-2" />
            <p>0900000, 888888</p>
            <p>Nairobi, Kenya</p>
            <div className="flex gap-4 mt-4 text-lg">
              <FaFacebookF />
              <FaInstagram />
              <FaWhatsapp />
            </div>
          </div>

          {/* Find Product */}
          <div>
            <h4 className="font-semibold mb-2">Find product</h4>
            <ul className="space-y-1 text-gray-600">
              <li><Link href="#">Brownze arnold</Link></li>
             <li><Link href="#">Smart phones</Link></li>
              <li><Link href="#">Automatic watch</Link></li>
              <li><Link href="#">Hair straighteners</Link></li>
            </ul>
          </div>

          {/* Get Help */}
          <div>
            <h4 className="font-semibold mb-2">Get help</h4>
            <ul className="space-y-1 text-gray-600">
              <li><Link href="#">About us</Link></li>
              <li><Link href="#">Contact us</Link></li>
              <li><Link href="#">Return policy</Link></li>
              <li><Link href="#">Privacy policy</Link></li>
              <li><Link href="#">Payment policy</Link></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="font-semibold mb-2">About us</h4>
            <ul className="space-y-1 text-gray-600">
              <li><Link href="#">News</Link></li>
              <li><Link href="#">Service</Link></li>
              <li><Link href="#">Our policy</Link></li>
              <li><Link href="#">Customer care</Link></li>
              <li><Link href="#">FAQs</Link></li>
            </ul>
          </div>

        </div>
      </footer>
    </>
  );
}
