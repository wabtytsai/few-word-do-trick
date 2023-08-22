import Link from 'next/link';

export default function Home() {
  return (
    <div className='app'>
      <Link href="/game/test">Click Me</Link>
    </div>
  )
}
