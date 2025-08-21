import config from "../config/env";

const BACKEND_URL = config.backendUrl;

// Helper function to get auth token
const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = localStorage.getItem("auth_token");
    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

// Generic API call function with authentication
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<Response> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  return response;
};

// Specific API functions
export const api = {
  // Spaces
  getSpaces: (token?: string | null) => apiCall("/space", {}, token),

  createSpace: (
    data: {
      spaceName: string;
      headerTitle: string;
      customMessage: string;
      question1: string;
      question2: string;
      question3: string;
    },
    token?: string | null
  ) =>
    apiCall(
      "/space/create",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    ),

  getSpace: (spaceName: string, token?: string | null) =>
    apiCall(`/space/${spaceName}`, {}, token),

  // Public endpoints (no authentication required)
  getPublicSpace: (spaceName: string) =>
    fetch(`${BACKEND_URL}/space/public/${spaceName}`),

  submitTestimonial: (
    spaceName: string,
    data: {
      content: string;
      image?: string;
      name: string;
      email: string;
    }
  ) =>
    fetch(`${BACKEND_URL}/space/${spaceName}/testimonials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  deleteTestimonial: (
    spaceName: string,
    testimonialId: string,
    token?: string | null
  ) =>
    apiCall(
      `/space/${spaceName}/testimonials/${testimonialId}`,
      {
        method: "DELETE",
      },
      token
    ),
};
