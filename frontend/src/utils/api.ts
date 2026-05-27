export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://yappier-api.botgampang123.workers.dev"; // Pastikan domain ini sesuai dengan milik Anda

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const tg = (window as any).Telegram?.WebApp;
  const initData = tg?.initData || "";
  
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `tma ${initData}`,
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Jika server merespons dengan error (misal 500 atau 401)
    if (!response.ok) {
      // Kita "baca" apa isi pesan aslinya
      const errorData = await response.json().catch(() => ({}));
      console.error("API Request Failed", response.status, errorData);
      
      // Lempar pesan asli dari server, bukan sekadar angka 500
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch API Exception", error);
    throw error;
  }
};