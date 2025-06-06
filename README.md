# 🗓️ Routiner

A modern calendar and productivity app that helps you manage routines, track habits, schedule classic events, and organize to-do tasks—all in one place.

---

## ✨ Features

- **Board View:** Plan your current week with a drag-and-drop board for tasks, routines, and events.
- **Calendar View:** Get a monthly overview and drill down into daily plans.
- **Tasks:** Add tasks with deadlines, times, and completion tracking.
- **Events:** Schedule events with dates, times, locations, and descriptions.
- **Routines:** Set up recurring routines and visualize them as time blocks.
- **Authentication:** Secure sign-up and sign-in with NextAuth.
- **Responsive Design:** Works beautifully on desktop and mobile.
- **Modern UI:** Built with Tailwind CSS and Flowbite React for a clean, intuitive interface.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Frontend:** [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Flowbite React](https://flowbite-react.com/)
- **Backend:** [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)
- **Database:** [MongoDB](https://www.mongodb.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Date Utilities:** [date-fns](https://date-fns.org/)
- **Testing:** [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Type Checking:** [TypeScript](https://www.typescriptlang.org/)

## Project Link
Check out the Routiner App [here](https://routiner-lovat.vercel.app)

---

## 🚀 Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/routiner.git
cd routiner
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the `routiner/` directory and add your MongoDB and NextAuth secrets:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
```

### 4. Run the development server

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🧪 Running Tests

```sh
npm test
```

---

## 📁 Project Structure

```
routiner/
  src/
    app/
      components/    # React components
      api/           # API routes (Next.js)
      lib/           # Utility libraries (API, user, bcrypt, etc.)
      types.ts       # Shared TypeScript types
      utils/         # Helper functions
    public/          # Static assets
  .env.local         # Environment variables
  tailwind.config.ts # Tailwind CSS config
  ...
```

---

## 💡 Inspiration

Routiner was created to help you plan your week, build healthy routines, and never lose track of your goals.  
Happy planning!