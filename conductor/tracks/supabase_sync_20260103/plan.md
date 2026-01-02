# Plan: Supabase Integration

## Phase 1: Infrastructure & Schema
- [x] Task: Install Dependencies [6bf450e]
    -   Install `@supabase/supabase-js`.
    -   Add environment variables to `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- [x] Task: Database Schema Setup [ebcb3d2]
    -   Create a `supabase/schema.sql` file documenting the required tables (`profiles`, `links`, `todos`, `notes`, `timers`) and RLS policies.
- [x] Task: Initialize Supabase Client [64ec923]
    -   Create `src/utils/supabaseClient.ts` (singleton instance).
    -   Write tests to verify client initialization (mocked).
- [ ] Task: Conductor - User Manual Verification 'Infrastructure & Schema' (Protocol in workflow.md)

## Phase 2: Authentication UI & Logic
- [ ] Task: Create Auth Store Slice
    -   Update `useDashboardStore` or create `useAuthStore` to manage `session`, `user`, and `authModalOpen` state.
- [ ] Task: Create Auth Modal Component
    -   Create `src/components/auth/AuthModal.tsx`.
    -   Implement Email/Password Sign Up and Login forms.
    -   Handle loading and error states.
- [ ] Task: Integrate Auth Trigger
    -   Add a "Login" button to the `CustomizationMenu` or `Header`.
    -   Ensure it opens the `AuthModal`.
- [ ] Task: Conductor - User Manual Verification 'Authentication UI & Logic' (Protocol in workflow.md)

## Phase 3: Data Synchronization Logic
- [ ] Task: Implement Sync Utility
    -   Create a helper to map Local Store state <-> Supabase Tables.
    -   Create `pushToCloud(table, data)` and `fetchFromCloud(table)` functions.
- [ ] Task: Sync Implementation - Links
    -   Update store to listen for changes to `links` and trigger push (debounced).
    -   Fetch `links` on load/login and merge with store.
- [ ] Task: Sync Implementation - Todos
    -   Update store to listen for changes to `todos` and trigger push.
    -   Fetch `todos` on load/login and merge.
- [ ] Task: Sync Implementation - Notes & Timers
    -   Update store to listen for changes to `notes` and `timers`.
    -   Fetch on load/login and merge.
- [ ] Task: Merge on Login Logic
    -   Implement the specific logic: On successful login -> Read Local State -> Read Cloud State -> Merge -> Update both.
- [ ] Task: Conductor - User Manual Verification 'Data Synchronization Logic' (Protocol in workflow.md)

## Phase 4: Verification & Polish
- [ ] Task: Verify RLS Policies
    -   Ensure users cannot access other users' data.
- [ ] Task: Conductor - User Manual Verification 'Supabase Integration' (Protocol in workflow.md)