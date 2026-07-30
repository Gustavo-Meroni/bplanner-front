import { redirect } from 'next/navigation';

/**
 * Root page — redirects to /dashboard.
 * In a production setup with auth middleware, this would redirect
 * to /login when the user is unauthenticated.
 */
export default function RootPage() {
  redirect('/dashboard');
}
