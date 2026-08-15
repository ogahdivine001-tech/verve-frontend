import { StrictMode, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import { useAuthStore } from './context/authStore'
import { useCartStore } from './context/cartStore'
import { useWishlistStore } from './context/wishlistStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Initializes auth/cart/wishlist on first load. Uses a ref guard so React 19
// StrictMode's dev-only double-invocation of effects doesn't fire this twice.
function AppInit() {
  const didInit = useRef(false)
  const init = useAuthStore((s) => s.init)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const loadCart = useCartStore((s) => s.loadCart)
  const loadWishlist = useWishlistStore((s) => s.loadWishlist)

  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    init()
  }, [init])

  useEffect(() => {
    if (isLoading) return
    loadCart()
    if (isAuthenticated) loadWishlist()
  }, [isLoading, isAuthenticated])

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInit />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
