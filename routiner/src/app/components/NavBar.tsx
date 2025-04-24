import Link from 'next/link';

export default function NavBar() {
    return (
        <nav className="flex items-center justify-between p-4 bg-accent text-neutral-100 shadow-sm">
            <Link href="/" className="text-2xl font-semibold">Routiner</Link>
            <div className="flex space-x-6 text-sm">
                <Link href="/" className="text-xl hover:underline">Home</Link>
                <Link href="/board" className="text-xl hover:underline">Board</Link>
                <Link href="/calendar" className="text-xl hover:underline">Calendar</Link>
            </div>
        </nav>
    );
}