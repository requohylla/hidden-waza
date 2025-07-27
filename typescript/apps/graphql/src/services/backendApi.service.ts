import axios from 'axios';

const BASE_URL = process.env.BACKEND_API_URL || 'http://localhost:8080/api/v1';

export class BackendApiService {
  async getLanguages() {
    const res = await axios.get(`${BASE_URL}/languages`);
    return res.data;
  }

  async getOSList() {
    const res = await axios.get(`${BASE_URL}/os`);
    return res.data;
  }

  async getTools() {
    const res = await axios.get(`${BASE_URL}/tools`);
    return res.data;
  }

  async login(email: string, password: string) {
    // デバッグ用ログ出力
    console.log('BFF login request:', {
      url: `${BASE_URL}/login`,
      email,
      password
    });
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        JSON.stringify({ email, password }),
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('BFF login response:', res.data);
      return res.data;
    } catch (err) {
      console.error('BFF login error:', err?.response?.data || err);
      throw err;
    }
  }

  async register(username: string, email: string, password: string) {
    const res = await axios.post(`${BASE_URL}/signup`, { username, email, password });
    return res.data;
  }

  async getResumes() {
    const res = await axios.get(`${BASE_URL}/resume`);
    // Go APIのレスポンスをGraphQLのResume型に変換
    return res.data.map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      title: item.title,
      description: item.summary ?? '', // summary→description
      date: '', // 必要ならitem.created_at等を加工
      skills: {
        os: (item.skills || []).filter((s: any) => s.type === 'os').map((s: any) => s.master_id),
        tools: (item.skills || []).filter((s: any) => s.type === 'tool').map((s: any) => s.master_id),
        languages: (item.skills || []).filter((s: any) => s.type === 'language').map((s: any) => s.master_id),
      },
      verified: false,
      createdAt: item.created_at ?? '',
      updatedAt: item.updated_at ?? '',
    }));
  }

  async createResume(resume: any) {
    const res = await axios.post(`${BASE_URL}/resume`, resume);
    return res.data;
  }
}