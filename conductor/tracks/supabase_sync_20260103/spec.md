# Specification: Supabase Integration & Data Sync

## 1. Overview
Integrate Supabase to provide User Authentication and Cloud Synchronization for all dashboard data (Links, Todos, Notes, Timers). This will transition the application from a "Local Only" app to a "Local First, Cloud Sync" application, allowing users to access their dashboard across multiple devices.

## 2. Functional Requirements

### 2.1 Authentication
-   **Provider:** Supabase Auth (Email & Password).
-   **UI:**
    -   Add a "Login / Sign Up" trigger (button/icon) to the existing UI (e.g., in the CustomizationMenu).
    -   **Modal Interface:** Clicking the trigger opens a Modal/Dialog for authentication.
    -   **State:** Handle `Loading`, `Error`, and `Authenticated` states within the modal.
    -   **Session Management:** Persist session tokens securely; auto-login on return.

### 2.2 Database & Schema
-   **Tables:** Create Supabase tables for:
    -   `user_settings` (Theme, layout preferences)
    -   `links` (Bookmarks, categories)
    -   `todos` (Tasks, status, ordering)
    -   `notes` (Content, timestamps)
    -   `timers` (Configuration, state)
-   **Security:** Enable Row Level Security (RLS) so users can only access their own data.

### 2.3 Data Synchronization (Full Sync)
-   **Strategy:** "Offline First"
    -   App continues to read/write from Local Storage/Zustand store for immediate UI updates.
    -   **Sync Engine:** A background process (hook or service) listens for store changes and pushes them to Supabase.
    -   **Real-time/Polling:** Subscribe to Supabase changes (Realtime) or poll on mount to update local store from cloud.
-   **On Login (Data Migration):**
    -   Detect if local data exists.
    -   **Merge/Upload:** Push existing local data to the newly authenticated user's cloud account.
    -   Ensure no data is lost during the transition.

### 2.4 User Interface
-   **Profile:** Display user email or avatar when logged in.
-   **Logout:** Ability to sign out (clear session and potentially clear/retain local data - default to retaining local copy).

## 3. Non-Functional Requirements
-   **Performance:** Sync operations must be non-blocking.
-   **Resilience:** Handle network errors gracefully.
-   **Env Vars:** Configuration via `.env` (SUPABASE_URL, SUPABASE_ANON_KEY).

## 4. Out of Scope
-   Social Logins (Google, GitHub) - *Can be added later.*
-   Complex Conflict Resolution (Merge conflicts) - *Last Write Wins / simple merging will be used.*
-   Sharing features (Public dashboards).