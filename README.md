alx-project-nexus/
│
├── README.md                   # Main repo README with project summary, learnings, and frontend/backend overview
│
├── byte-mtaani-backend-docs/   # Backend documentation folder
│   ├── database_design.md      # Database tables, fields, indexing, ERD, relationships, security rules
│   ├── models.md               # Django/ORM models for Users, Products, Orders, Payments
│   ├── api_endpoints.md        # List of API endpoints, methods, parameters, responses
│   ├── checkout_flow.md        # Cart → Order → Payment → Confirmation flow
│   ├── payment_integration.md  # Integration with M-PESA, mock setups, webhooks
│   ├── api_flow.md             # API request/response flow, authentication headers
│   ├── checkout_process.md     # Step-by-step checkout process with example calls
│   ├── roles_and_permissions.md # User roles, admin/customer permissions, access rules
│   ├── system_workflow.md      # High-level system workflow and interaction diagram
│
└── frontend-docs/              # Frontend documentation folder
    ├── overview.md             # Short summary of frontend stack and purpose
    ├── architecture.md         # Project structure: pages, components, hooks, utils, layouts, services
    ├── ui_components.md        # Reusable components with examples and props
    ├── styling_guide.md        # Tailwind rules: colors, spacing, typography, breakpoints
    ├── typescript_guide.md     # TypeScript conventions, interfaces, types, enums, folder rules
    ├── api_consumption.md      # Service layer, fetch patterns, error handling, env variables, auth
    ├── state_management.md     # Local state, server state, caching, useState, useReducer, hooks
    ├── routing.md              # Next.js routing: file-based, dynamic, layouts, metadata
    ├── performance.md          # Frontend optimization: code splitting, lazy loading, memoization, images
    ├── deployment.md           # Build steps, env variables, hosting, monitoring, CI/CD
    └── testing.md              # Unit, integration, E2E tests, tools, best practices
