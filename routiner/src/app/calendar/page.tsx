import Calendar from "../components/Calendar";
import NavBar from "../components/NavBar";

export default function Home() {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="p-4 bg-gray-800 text-white text-center">
          <NavBar/>
        </header>
        <main className="flex-grow flex flex-col sm:flex-row">
          <div className="flex-1 p-4">
            {<Calendar />}
          </div>
        </main>
      </div>
    );
}