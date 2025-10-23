export async function newUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    console.log("0", data);
    const res = await fetch(
      "https://journeysoul-server.onrender.com/api/users/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    console.log("1", res);
    if (!res.ok) {
      throw new Error(`Failed to register: ${res.statusText}`);
    }

    const result = await res.json();
    return result; // this is your server response (user info or message)
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
