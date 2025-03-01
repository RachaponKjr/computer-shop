const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const GetUser = async (token) => {
  try {
    const response = await fetch(`${backendUrl}/api/user/getUser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (result.success) {
      return result.user;
    }
  } catch (error) {
    console.error(error);
  }
};
