import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PageTransition from '../components/ui/PageTransition'

export default function MainLayout() {
  const location = useLocation()

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <main>
            <Outlet />
          </main>
        </PageTransition>
      </AnimatePresence>
      <Footer />
    </>
  )
}
