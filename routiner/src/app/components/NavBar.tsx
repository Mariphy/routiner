import Link from 'next/link';

export default function NavBar() {
    return (
        <nav className="flex-row justify-between items-stretch p-4 bg-accent text-white">
            <h1 className="text-2xl">Routiner App</h1>
            <div className="flex space-x-4">
                <Link className="text-white m-4" href="/"> Home </Link>
                <Link className="text-white m-4" href="/board"> Board </Link>
                <Link className="text-white m-4" href="/calendar"> Calendar </Link>
            </div>
        </nav>
    );
}