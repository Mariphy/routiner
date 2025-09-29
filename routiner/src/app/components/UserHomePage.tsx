import Link from "next/link";

export default function UserHomePage() {

  return (
    <div>
        <p className="mt-4">
              Use the <span className="font-semibold">Board</span> section to plan your current week. On the <span className="font-semibold">Calendar</span> page you can find your month overview or dig  deeper on your daily plans. 
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
        <p className="mt-4">
            <span className="font-semibold">Happy Planning!</span>
        </p>
        <Link href="/settings" className="text-xl hover:underline">Settings</Link>  
        <Link href="/api/auth/signout">
            <button className="bg-green-500 text-white m-6 px-4 py-2 rounded hover:bg-green-600">
              Sign Out
            </button>
        </Link>      
    </div>
  );
}