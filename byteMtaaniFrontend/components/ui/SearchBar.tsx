"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  placeholder?: string;
};

export default function SearchBar({ placeholder = "Search..." }: Props) {
  const [q, setQ] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple route to /products with query param
    if (q.trim()) {
      router.push(`/products?q=${encodeURIComponent(q.trim())}`);
    } else {
      router.push(`/products`);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-2xl">
      <div className="flex items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded-l-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#003F62]"
          aria-label="Search products"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-r-md bg-brandYellow text-[#292D32] font-medium hover:opacity-95"
          aria-label="Search"
          style={{ backgroundColor: "#EDA415" }}
        >
          Search
        </button>
      </div>
    </form>
  );
}
