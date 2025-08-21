import { createDb, spaces, testimonials } from "../db";
import { authenticateUser, authorizeSpaceOwner } from "../middleware/auth";
import { eq, and, desc } from "drizzle-orm";

interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

interface CreateSpaceBody {
  spaceName: string;
  headerTitle: string;
  customMessage: string;
  question1: string;
  question2: string;
  question3: string;
}

interface TestimonialBody {
  content: string;
  image?: string;
  name: string;
  email: string;
}

export async function spaceHandler(
  request: Request,
  path: string,
  env: Env
): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  try {
    // Extract space name from path
    const pathParts = path.split("/").filter(Boolean);
    const spaceName = pathParts[1]; // /space/[spaceName] or /space/public/[spaceName]

    // Handle different routes
    if (path === "/space/create" && request.method === "POST") {
      return await handleCreateSpace(request, env);
    } else if (path === "/space" && request.method === "GET") {
      return await handleGetSpaces(request, env);
    } else if (path.startsWith("/space/public/") && request.method === "GET") {
      const publicSpaceName = pathParts[2];
      return await handleGetPublicSpace(publicSpaceName, env);
    } else if (
      path.startsWith("/space/") &&
      path.endsWith("/testimonials") &&
      request.method === "POST"
    ) {
      return await handleSubmitTestimonial(spaceName, request, env);
    } else if (
      path.startsWith("/space/") &&
      path.includes("/testimonials/") &&
      request.method === "DELETE"
    ) {
      const testimonialId = pathParts[3];
      return await handleDeleteTestimonial(
        spaceName,
        testimonialId,
        request,
        env
      );
    } else if (path.startsWith("/space/") && request.method === "GET") {
      return await handleGetSpace(spaceName, request, env);
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error in spaceHandler:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
}

async function handleCreateSpace(
  request: Request,
  env: Env
): Promise<Response> {
  const db = createDb(env.DATABASE_URL);
  const user = await authenticateUser(request, env);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = (await request.json()) as CreateSpaceBody;
  const {
    spaceName,
    headerTitle,
    customMessage,
    question1,
    question2,
    question3,
  } = body;

  // Check if space name already exists for this user
  const existingSpace = await db
    .select()
    .from(spaces)
    .where(and(eq(spaces.spaceName, spaceName), eq(spaces.userId, user.id)))
    .limit(1);

  if (existingSpace.length > 0) {
    return new Response(
      JSON.stringify({ error: "Space name already exists" }),
      { status: 409, headers: { "Content-Type": "application/json" } }
    );
  }

  const newSpace = await db
    .insert(spaces)
    .values({
      spaceName,
      headerTitle,
      customMessage,
      question1,
      question2,
      question3,
      userId: user.id,
    })
    .returning();

  return new Response(JSON.stringify(newSpace[0]), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

async function handleGetSpaces(request: Request, env: Env): Promise<Response> {
  const db = createDb(env.DATABASE_URL);
  const user = await authenticateUser(request, env);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userSpaces = await db
    .select()
    .from(spaces)
    .where(eq(spaces.userId, user.id))
    .orderBy(desc(spaces.createdAt));

  return new Response(JSON.stringify(userSpaces), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

async function handleGetSpace(
  spaceName: string,
  request: Request,
  env: Env
): Promise<Response> {
  const db = createDb(env.DATABASE_URL);
  const user = await authenticateUser(request, env);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const space = await authorizeSpaceOwner(request, spaceName, user.id, env);
  if (!space) {
    return new Response(
      JSON.stringify({
        error: "Access denied. Space not found or you don't own it.",
      }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // Get space with testimonials
  const spaceWithTestimonials = await db
    .select()
    .from(spaces)
    .where(and(eq(spaces.spaceName, spaceName), eq(spaces.userId, user.id)))
    .limit(1);

  if (spaceWithTestimonials.length === 0) {
    return new Response(JSON.stringify({ error: "Space not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const spaceData = spaceWithTestimonials[0];
  const spaceTestimonials = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.spaceId, spaceData.id));

  return new Response(
    JSON.stringify({ ...spaceData, testimonials: spaceTestimonials }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

async function handleGetPublicSpace(
  spaceName: string,
  env: Env
): Promise<Response> {
  const db = createDb(env.DATABASE_URL);
  const space = await db
    .select()
    .from(spaces)
    .where(eq(spaces.spaceName, spaceName))
    .limit(1);

  if (space.length === 0) {
    return new Response(JSON.stringify({ error: "Space not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const spaceData = space[0];
  const spaceTestimonials = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.spaceId, spaceData.id));

  return new Response(
    JSON.stringify({ ...spaceData, testimonials: spaceTestimonials }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

async function handleSubmitTestimonial(
  spaceName: string,
  request: Request,
  env: Env
): Promise<Response> {
  const db = createDb(env.DATABASE_URL);
  const body = (await request.json()) as TestimonialBody;
  const { content, image, name, email } = body;

  const space = await db
    .select()
    .from(spaces)
    .where(eq(spaces.spaceName, spaceName))
    .limit(1);

  if (space.length === 0) {
    return new Response(JSON.stringify({ error: "Space not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const newTestimonial = await db
    .insert(testimonials)
    .values({
      content,
      image,
      name,
      email,
      spaceId: space[0].id,
    })
    .returning();

  return new Response(JSON.stringify(newTestimonial[0]), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

async function handleDeleteTestimonial(
  spaceName: string,
  testimonialId: string,
  request: Request,
  env: Env
): Promise<Response> {
  const db = createDb(env.DATABASE_URL);
  const user = await authenticateUser(request, env);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const space = await authorizeSpaceOwner(request, spaceName, user.id, env);
  if (!space) {
    return new Response(
      JSON.stringify({
        error: "Access denied. Space not found or you don't own it.",
      }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  const testimonial = await db
    .select()
    .from(testimonials)
    .where(
      and(
        eq(testimonials.id, testimonialId),
        eq(testimonials.spaceId, space.id)
      )
    )
    .limit(1);

  if (testimonial.length === 0) {
    return new Response(JSON.stringify({ error: "Testimonial not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  await db.delete(testimonials).where(eq(testimonials.id, testimonialId));

  return new Response(
    JSON.stringify({ message: "Testimonial deleted successfully" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
