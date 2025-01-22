export default async function Home() {
  const response = await fetch('localhost:3000/api/routines');
  const routines = await response.json(); 

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-gray-800 text-white text-center">
        <h1 className="text-2xl">Calendar Application</h1>
      </header>
      <main className="flex-grow flex flex-col sm:flex-row">
        <div className="flex-1 p-4">
          <h2 className="text-xl">Kanban Board</h2>
          {/* Board component will be rendered here */}
        </div>
        <div className="flex-1 p-4">
          <h2 className="text-xl">Calendar View</h2>
          {/* Calendar component will be rendered here */}
        </div>
      </main>
    </div>
  );
}