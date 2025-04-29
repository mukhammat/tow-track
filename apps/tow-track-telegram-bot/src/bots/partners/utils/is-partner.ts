export const isPartner = async (chatId: number, towTrack: Fetcher) => {
    try {
        const response = await towTrack.fetch('http://127.0.0.1:8787/api/auth/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ telegram_id: chatId })
        });
        return response.ok || false;
    } catch (error) {
        console.error("Auth middleware error:", error);
        return false;
    }
};
