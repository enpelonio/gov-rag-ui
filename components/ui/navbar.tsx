import { Logo } from './logo'

export function NavBar() {
  return (
    <nav className="bg-white shadow-md p-4 fixed top-0 z-50 w-full">
      <div className="container">
        <Logo />
      </div>
    </nav>
  )
}

