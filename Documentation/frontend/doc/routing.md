Routing Guide

This document outlines how routing works in the Next.js frontend. It covers file based routing, dynamic routes, layouts, and metadata rules used across the project.

File Based Routing

Next.js builds routes from your folder structure.

pages
• app/page.tsx becomes the homepage
• app/products/page.tsx becomes /products
• app/cart/page.tsx becomes /cart

Nested Folders
Each folder under app creates its own route segment.

app
products
page.tsx → /products
featured
page.tsx → /products/featured

Rules
• Each folder can contain one page.tsx
• Layouts define shared UI for everything inside a folder
• Components do not affect routing

Dynamic Routes

Used for pages that require a parameter.

Folder Syntax
app/products/[id]/page.tsx → /products/123

Accessing Params
export default function ProductPage({ params }) {
return <div>Product ID: {params.id}</div>;
}

Multiple Params
app/store/[category]/[item]/page.tsx
Route example → /store/electronics/phone

Route Groups

Used to organize files without affecting the URL.

Syntax
app/(dashboard)/users/page.tsx
URL → /users

Groups help structure large projects.

Examples
• (auth) for login, register
• (dashboard) for admin panels
• (public) for public pages

Layout System

Next.js layouts wrap pages inside a shared shell.

app/layout.tsx
Defines the global template:
• nav
• footer
• global providers
• theme setup

Folder Layouts
app/products/layout.tsx
Applies only to the /products section.

Usage Example
export default function ProductsLayout({ children }) {
return (
<div className="flex">
<aside className="w-64">Sidebar</aside>
<main>{children}</main>
</div>
);
}

Shared Metadata

Metadata controls SEO, titles, descriptions.

Basic
export const metadata = {
title: "ByteMtaani",
description: "Ecommerce platform",
};

Dynamic Metadata
export async function generateMetadata({ params }) {
return {
title: Product ${params.id},
};
}

Types of metadata used
• title
• description
• openGraph
• keywords

API Routes (If Needed)

Placed under app/api.

Example
app/api/products/route.ts
Methods inside:
• GET
• POST
• PUT
• DELETE

Basic
export async function GET() {
return Response.json({ message: "ok" });
}

Navigation

Navigation uses Next.js components.

Link
import Link from "next/link";

<Link href="/products">Browse</Link>

Programmatic Navigation
useRouter from next/navigation

const router = useRouter();
router.push("/cart");

Routing Conventions

• All page components live in the app directory
• Dynamic segments use [param]
• Catch all routes use [...slug]
• Use loading.tsx for skeleton loading screens
• Use error.tsx for error states
• Use layout.tsx for shared frameworks

Example: Catch All
app/blog/[...slug]/page.tsx
Matches
/blog/a
/blog/a/b
/blog/a/b/c