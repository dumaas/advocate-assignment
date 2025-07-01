import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;

  const offset = (page - 1) * limit;
  const data = await db.select().from(advocates).limit(limit).offset(offset);

  return Response.json({ data });
}
