/**
 * @jest-environment node
*/

import { connectToDb } from "@/app/api/db";
import { GET, POST } from "./route"; // Import your route handlers

describe("Tasks API Route", () => {
  let db: import("mongodb").Db;

  beforeAll(async () => {
    const connection = await connectToDb();
    db = connection.db;
  });

  afterAll(async () => {
    await db.collection("users").deleteMany({ email: "test@example.com" }); // Clean up test data
  });

  it("fetches tasks for a user", async () => {
    // Insert a test user into the database
    const testUser = {
      email: "test@example.com",
      tasks: [
        { id: "1", title: "Test Task 1", checked: false },
        { id: "2", title: "Test Task 2", checked: true },
      ],
    };
    await db.collection("users").insertOne(testUser);

    // Call the GET handler
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.tasks).toHaveLength(2);
    expect(data.tasks[0].title).toBe("Test Task 1");
  });

  it("adds a task for a user", async () => {
    const req = new Request("http://localhost/api/users/test/tasks", {
      method: "POST",
      body: JSON.stringify({
        task: { id: "3", title: "New Task", checked: false },
        params: { id: "test@example.com" },
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.task.title).toBe("New Task");

    // Verify the task was added to the database
    const user = await db.collection("users").findOne({ email: "mia@example.com" });
    expect(user).not.toBeNull();
    expect(user!.tasks).toHaveLength(3);
  });
});