UI Components

This document outlines the core reusable components in the frontend. Each component supports consistency, faster development, and predictable behavior across the application.

Buttons

Buttons handle all primary and secondary actions across the UI.

Props

label: Text displayed on the button

onClick: Function triggered on press

variant: primary, secondary, outline

disabled: Boolean to disable interactions

loading: Boolean to show a spinner

Example
<Button
  label="Add to Cart"
  variant="primary"
  onClick={handleAdd}
/>

Inputs

Inputs collect user data in forms for login, checkout, and search.

Props

label: Field label

type: text, email, password, number

value

onChange

error: Validation message

Example
<Input 
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
/>

Cards

Cards display grouped content like products, categories, and orders.

Props

title

image

price (optional for product cards)

onClick

Example
<ProductCard
  title="Wireless Earbuds"
  image="/images/earbuds.jpg"
  price={2499}
  onClick={() => router.push("/product/earbuds")}
/>

Navigation

Navigation components include the main navbar, mobile menu, and footer.

Props

links: Navigation items

user: Auth state for conditional menus

onToggleMenu

Example
<Navbar
  links={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }]}
  user={sessionUser}
/>

Loaders

Loaders show a visual indicator during data fetches or background tasks.

Types

Spinner

Skeleton

Example
<Spinner />

<Skeleton className="h-40 w-full" />