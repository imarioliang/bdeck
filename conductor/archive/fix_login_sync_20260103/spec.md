# Specification: Fix Local Data Loss on Login

## 1. Overview
A critical bug has been identified where local data (created while anonymous) is deleted and replaced by cloud data upon user login. This contradicts the intended "Merge/Upload" strategy, where existing local data should be uploaded to the user's account during the first login to ensure no work is lost.

## 2. Functional Requirements

### 2.1 Restore Merge-on-Login Strategy
- **Detection:** Correctly identify the transition from an "Anonymous" state (no `lastUserId`) to an "Authenticated" state.
- **Upload Priority:** Ensure that local data (Links, Todos, Notes, Timers) is pushed to Supabase *before* the cloud state is fetched and applied to the local store.
- **Merge Consistency:** The final local state after login should be a union of the previous local data and the fetched cloud data (using IDs to prevent duplicates).

### 2.2 Fix User Switch Logic
- **Refinement:** Ensure the "Wipe on User Switch" logic (User A -> User B) remains intact but does not accidentally trigger during an "Anonymous -> User A" transition.
- **State Settlement:** Ensure that state updates during the login transition are properly sequenced so that the `SyncManager` doesn't enter a race condition between pushing stale data and pulling fresh data.

## 3. Acceptance Criteria
- [ ] Create a local link while logged out, then log in. The link must persist and be uploaded to the Supabase database.
- [ ] Create a local todo while logged out, then log in. The todo must persist and be uploaded.
- [ ] Verify that logging in as a *different* user still correctly wipes the previous user's data (privacy requirement).

## 4. Out of Scope
- Implementing advanced conflict resolution (e.g., merging individual text changes within a single note).
- Changing the overall "Last Write Wins" sync strategy.
