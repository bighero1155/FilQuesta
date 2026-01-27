import axios from "../auth/axiosInstance";

export const logPageVisit = async (
  user_id: number,
  page: string,
  time_spent: number
) => {
  try {
    await axios.post("/page-visits", { 
      user_id,
      page,
      time_spent,
    });
  } catch (error) {
    console.error("Error logging page visit:", error);
  }
};
export const logGameOver = async (user_id: number, page: string) => {
  try {
    await axios.post("/page-visits/gameover", {
      user_id,
      page,
    });
  } catch (error) {
    console.error("Error logging game over:", error);
  }
};
export const getUserGameOverLogs = async (user_id: number) => {
  try {
    const res = await axios.get(`/page-visits?user_id=${user_id}`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching gameover logs:", error);
    throw error;
  }
};
