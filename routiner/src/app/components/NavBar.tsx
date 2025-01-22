import Link from 'next/link';

export default function NavBar() {
    return (
        <nav className="flex-row justify-between items-stretch p-4 bg-gray-800 text-white">
            <h1 className="text-2xl">Routiner App</h1>
            <div className="mt-4">
            <Link href="/board"> Board </Link>
            <Link href="/calendar"> Calendar </Link>
            </div>
        </nav>
    );
}