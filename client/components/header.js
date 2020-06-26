import Link from 'next/link'

export default function Header({ currentUser }) {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((link) => link)
    .map(({ label, href }) => (
      <li key={href}>
        <Link href={href}>
          <a className="nav-link">{label}</a>
        </Link>
      </li>
    ))

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <d className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </d>
    </nav>
  )
}
