Frontend Architecture

The frontend follows a modular and predictable structure built around Next.js conventions. Each part of the project plays a clear role. This makes the codebase easy to maintain, scale, and onboard new developers.

Project Structure
Pages

The pages directory handles routing. Each file represents a route in the application. Pages can include server components or client components depending on the requirements. Dynamic routes handle product details, carts, and user profiles.

Components

Reusable UI elements live in the components folder. Examples include cards, buttons, product grids, navbars, and modals. Components follow a consistent design system powered by Tailwind. Complex UI sections are split into smaller, clear pieces.

Layouts

Layouts define the structure shared across pages. Common examples include the main layout, authentication layout, and admin layout. Layouts reduce repetition and keep the UI aligned across routes.

Hooks

Custom hooks provide shared behavior for components. These include state management patterns, data fetching logic, form handlers, and business logic not tied to UI elements. Hooks improve code reuse and readability.

Utils

The utils folder stores helper functions for formatting, validation, calculations, and shared logic. These utilities remain pure and independent of UI. They support consistency across the application.

Services

Services handle communication with backend APIs. Each service file maps to a domain, such as products, authentication, cart, orders, and payments. Services define all HTTP requests in one place, which supports a clean integration layer and easier refactoring.

Goal of the Architecture

The structure ensures a clear separation of concerns. Pages focus on routing. Components handle UI. Hooks, utils, and services handle logic. This approach keeps the frontend organized and scalable for future features like search, filtering, and admin dashboards.