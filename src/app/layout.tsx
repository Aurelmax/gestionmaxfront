import './globals.css'

// Root layout minimal - ne définit PAS <html> ni <body>
// Les groupes de routes (app) et (payload) gèrent leurs propres layouts
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
