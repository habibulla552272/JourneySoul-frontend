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

// fetch blog

export async function FetchBlog() {
  try {
    const res = await api.get(`/blogs`);
    return res?.data?.data;
  } catch (error) {
    console.log(error);
  }
}

// profile fetch

export async function userProfile() {
  const userId = localStorage.getItem("userId");
  if (userId) {
    try {
      const res = await api.get(`/users/${userId}/profile`);
      return res?.data;
    } catch (error) {
      console.log(error);
    }
  }else{
    console.log("No userId found in localStorage"); 
  }
}


//like blog

// /blogs/:blogId/like

export async function likeUnlike(id:string) {
    const userId= localStorage.getItem("userId");
    if(userId){
      try{
        const res= await api.post(`/blogs/${id}/like`)
      }catch(error){
        console.log(error)
      }
    }else{
      console.log('no user id found')
    }
}
