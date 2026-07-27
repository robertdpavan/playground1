// Current-user source for the top-bar account button.
//
// TODO(auth): There is no auth/user context wired into this app yet. When one
// exists (an AuthProvider, a session cookie, a `/me` endpoint, Auth0, etc.),
// replace the body of `useCurrentUser` below to return the real signed-in user.
// The rest of the UI only needs `name` to derive the avatar initials.

export interface CurrentUser {
  name: string
  username: string
  email: string
}

export function useCurrentUser(): CurrentUser {
  // TODO(auth): return the real signed-in user here instead of this placeholder.
  return {
    name: 'Robert Pavan',
    username: 'robertpavan',
    email: 'robert.pavan@raventelemetry.com',
  }
}

/** Up-to-two-letter initials from a display name; falls back to "RP". */
export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'RP'
  const first = parts[0].charAt(0)
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : ''
  return (first + last).toUpperCase() || 'RP'
}
