import { User } from "@/hooks/dashboard";
import axios from "axios";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

// crate axios instance

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      console.log("token", token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("No token in session");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function newUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    console.log("0", data);
    const res = await api.post(`/users/register`, data);
    console.log("1", res);
    return res.data;
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
}
export async function loginUser(data: { email: string; password: string }) {
  try {
    const res = await fetch(
      `https://journeysoul-server.onrender.com/api/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      throw new Error(`Login failed: ${res.statusText}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
}

// blog
export async function SingleBlogForStatic(id: string) {
  try {
    const res = await api.get(`/blogs/${id}`);
    return res?.data?.data;
  } catch (error) {
    console.log('Error fetching single blog:', error);
    throw error;
  }
}
export async function AllBlogsForStatic() {
  try {
    const res = await api.get(`/blogs`);
    return res?.data?.data;
  } catch (error) {
    console.log('Error fetching all blogs:', error);
    return [];
  }
}
// fetch blog

export async function FetchBlog() {
  try {
    const res = await api.get(`/blogs`);
    return res?.data?.data;
  } catch (error) {
    console.log(error);
  }
}
export async function SingleBlog(id: string) {
  try {
    const res = await api.get(`/blogs/${id}`);
    return res?.data?.data;
  } catch (error) {
    console.log(error);
  }
}
// blog delete 

export async function blogDelete(id: string) {
  try {
    const res = await api.delete(`/blogs/${id}`)
    return res.data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to delete');
    }
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function blogUpdate(id: string, data: any) {
  try {

    const res =await api.patch(`blogs/${id}`, data)
    return res.data
  } catch (error) {
    console.log(error)
  }
}
// profile fetch

export async function userProfile() {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return null;
  }

  const userId = localStorage.getItem("userId");
  if (!userId) {
    return null; // Return null instead of undefined
  }

  try {
    const res = await api.get(`/users/${userId}/profile`);
    return res?.data || null; // Ensure we return null if data is undefined
  } catch (error) {
    console.log("Profile fetch error:", error);
    return null; // Return null on error instead of undefined
  }
}


//like blog

// /blogs/:blogId/like

export async function likeUnlike(id: string) {
  const userId = localStorage.getItem("userId");
  if (userId) {
    try {
      const res = await api.post(`/blogs/${id}/like`);
      return res.data;
    } catch (error) {
      console.log(error)
    }
  } else {
    console.log('no user id found')
  }
}


export async function createComment(id: string, text: string) {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!userId) {
    throw new Error("Please login to comment");
  }

  try {
    const res = await api.post(`/blogs/${id}/comments`, {
      text: text,
      userId: userId,
      category: '',
      // new comment add korte hobe 
    });
    return res.data;
  } catch (error) {
    console.log("Comment creation error:", error);
    // throw new Error(error.response?.data?.message || "Failed to create comment");
  }
}


export async function getComments(id: string) {
  console.log(' blog id', id)
  const userId = localStorage.getItem("userId");
  if (userId) {
    try {
      const res = await api.get(`/blogs/${id}/comments`);
      return res.data.comments
    } catch (error) {
      console.log(error)
    }
  } else {
    console.log('no user id found')
  }
}



// all user data fetch

export async function allUserData() {
  try {
    const res = await api.get("/users")
    console.log('check user data 1', res)
    return res.data;
  } catch (error) {
    console.log(error)
  }
}

//single user 
export async function singleuser(id: string) {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// delete user 


export async function userDelete(id: string) {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (error) {
    console.log(error)
  }

}


// new post create

export async function userUpdate(id: string, data: Partial<User>) {
  try {
    const res = await api.patch(`/users/${id}`, data);
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
}

export default api