'use client'
import { useClerk } from '@clerk/nextjs'

export function AuthButtons() {
  const { openSignIn, openSignUp } = useClerk()
  return (
    <div className="flex gap-2">
      <button
        onClick={() => openSignIn()}
        className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
      >
        Sign in
      </button>
      <button
        onClick={() => openSignUp()}
        className="px-4 py-2 text-sm font-medium rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
      >
        Sign up
      </button>
    </div>
  )
}
