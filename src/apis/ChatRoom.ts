import axios from "axios";

const baseUrl = 'https://mdm-ai-api-498807929429.us-central1.run.app'

const sendPrompt = async (prompt: string, user_id: string) => {
    try {
      const response = await axios.post(`${baseUrl}/chat`, { prompt, user_id });
      return response.data.response;
    } catch (error) {
      return "Sorry, I couldn't process your request.";
    }
  }; 

export { sendPrompt };