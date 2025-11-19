state_management.md
State Management Guide

This document explains how state is handled across the frontend. It covers local state, server state, caching rules, and the core React patterns used in the project.

State Categories

State in the app falls into three groups.

Local State
Handled inside components.
Used for UI elements.
Examples
• dropdown open or closed
• modal visibility
• form inputs
• pagination page number

Server State
Fetched from backend services.
Synced through API calls.
Examples
• product lists
• single product
• user profile
• cart content

Global UI State
Shared across multiple pages.
Used sparingly.
Examples
• theme
• auth user info
• cart count

Tools Used

React built-in primitives
• useState
• useEffect
• useReducer
• useRef

Lightweight custom hooks
• useFetch
• useAuth
• useCart
These help reduce repetitive logic.

No heavy global libraries
The project avoids Redux and Zustand unless a future feature demands them.

Local State Pattern

Local UI state stays inside components.

Example
const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Open Modal</button>

Server State: Fetch + Cache Pattern

Server data flows through three steps.

Step 1
Call service methods like ProductsService.getAll.

Step 2
Store in component state.

Example
const [products, setProducts] = useState([]);

useEffect(() => {
load();
}, []);

const load = async () => {
const response = await ProductsService.getAll();
setProducts(response.data);
};

Step 3
Cache rules
• Keep the cache short lived.
• Cache data inside components when needed.
• Refresh on page navigation.
• Use useEffect dependency rules.

Custom Fetch Hook

Custom hooks handle repetitive fetching logic.

Example
import { useState, useEffect } from "react";

export const useFetch = <T>(fn: () => Promise<T>) => {
const [data, setData] = useState<T | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
load();
}, []);

const load = async () => {
try {
const response = await fn();
setData(response);
} catch (e) {
setError("Failed to load data");
} finally {
setLoading(false);
}
};

return { data, loading, error };
};

Usage
const { data, loading } = useFetch(() => ProductsService.getAll());

useReducer for Complex UI Logic

Used when a single component has multiple related actions.

Example
interface State {
step: number
form: { name: string, email: string }
}

type Action =
| { type: "NEXT" }
| { type: "UPDATE_FORM"; payload: Partial<State["form"]> };

const reducer = (state: State, action: Action): State => {
if (action.type === "NEXT") return { ...state, step: state.step + 1 };
if (action.type === "UPDATE_FORM")
return { ...state, form: { ...state.form, ...action.payload } };
return state;
};

const [state, dispatch] = useReducer(reducer, initialState);

Global State Rules

Global state is limited to:

Auth
Stores: token, user info.

Cart
Stores: items, item count.

These use simple context providers.

AuthContext Example
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
const [user, setUser] = useState(null);

const login = async (email: string, password: string) => {
const response = await AuthService.login(email, password);
setUser(response.data.user);
};

return (
<AuthContext.Provider value={{ user, login }}>
{children}
</AuthContext.Provider>
);
}

Caching Approach

Rules
• Cache server data in memory through component state.
• Only cache expensive calls like product list or categories.
• Clear cache after logout.
• Avoid global caching libraries unless performance becomes a concern.

When to refresh data
• user switches pages
• user performs an action
• user updates profile
• stock changes
• cart updates

Summary Rules

• Local state stays inside components
• Server state comes from services and is typed
• Complex UI logic uses useReducer
• Global state stays minimal
• Custom hooks reduce repetition
• No external state libraries unless needed later