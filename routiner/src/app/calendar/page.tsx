import Calendar from "../components/Calendar";

export default function Home() {
    return (
      <main className="flex-grow flex flex-col sm:flex-row pt-12">
        <div className="flex-1 p-4">
          {<Calendar />}
        </div>
      </main>
    );
}