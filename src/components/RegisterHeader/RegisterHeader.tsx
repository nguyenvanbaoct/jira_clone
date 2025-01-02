import { Link } from 'react-router-dom'

export default function RegisterHeader() {
  return (
    <header className='py-5'>
      <div className='container'>
        <nav className='text-center'>
          <Link to='/' className='text-xl font-bold lg:text-4xl'>
            Cyberbugs
          </Link>
        </nav>
      </div>
    </header>
  )
}
