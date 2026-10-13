import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  try {
    const { name, email, clerkId } = await req.json();

    if (!name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error("DATABASE_URL is not configured on the API server");
      return Response.json(
        { error: "Database is not configured" },
        { status: 500 },
      );
    }
    const sql = neon(databaseUrl);

    const res = await sql`
    INSERT INTO users (
        name, email, clerk_id
    )
    VALUES (
        ${name}, ${email}, ${clerkId}
    )
    RETURNING name, email, clerk_id
  `;

    return Response.json({ data: res }, { status: 201 });
  } catch (error) {
    console.error("Failed to save user to database:", error);
    return Response.json(
      { error: "Unable to save user to database. Check the API server logs." },
      { status: 500 },
    );
  }
}
