import Link from "next/link";
import Image from "next/image";

export default function GuestHomePage() {

  return (
    <div className="text-center m-6">
        <h1 className="text-2xl font-bold">Welcome to Routiner!</h1>
        <p className="mt-4">Sign in or sign up to start managing your tasks efficiently.</p>
        <div className="mt-6 flex justify-center gap-4">
            <Link href="/api/auth/signin">
            <button className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-hover">
                Sign In
            </button>
            </Link>
            <Link href="/signup">
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Sign Up
            </button>
            </Link>
        </div>
        <p className="mt-4">
            We created this app as a way to help you plan and manage your time easier.
            Add daily routines that won&apos;t disrupt your day and are flexible enough to plan around. 
            Never lose track of the tasks you record as events, instead, block time for your tasks with flexibility.
        </p>
        <p className="mt-4">
            Use the <span className="font-semibold">Board</span> section to plan your current week. On the <span className="font-semibold">Calendar</span> page you can find your month overview or dig deeper on your daily plans. 
        </p>
        <p className="mt-4">
            Create tasks, events, or routines.
            <br />
            <span className="font-semibold">Routines</span> are usefull to set up repetitions, they will be marked in your calendar as time blocks.
            <br />
            <span className="font-semibold">Events</span> are your usual calendar events with a set day and time.
            <br />
            While <span className="font-semibold">tasks</span> can also have a set day and time, they will not disappear from your Task List unless you mark them as completed.
        </p>
        <Image 
            src="/board-example.png"
            alt="Board Example"
            width={800}
            height={600}
            className="rounded-lg shadow-md mx-auto m-6"
        />
        <p className="mt-4">
            <span className="font-semibold">Happy Planning!</span>
        </p>
    </div>
  );
}