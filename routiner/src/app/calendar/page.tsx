import Board from "../components/Board";
import Calendar from "../components/Calendar";

export default function Home() {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="p-4 bg-gray-800 text-white text-center">
          <h1 className="text-2xl">Calendar Application</h1>
        </header>
        <main className="flex-grow flex flex-col sm:flex-row">
          <div className="flex-1 p-4">
            <h2 className="text-xl">Kanban Board</h2>
            {/*Board*/}
          </div>
          <div className="flex-1 p-4">
            <h2 className="text-xl">Calendar View</h2>
            {<Calendar />}
          </div>
        </main>
      </div>
    );
  }