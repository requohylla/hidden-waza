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

  async getResumes(userId?: number) {
    let url = `${BASE_URL}/resume`;
    if (userId !== undefined) {
      url = `${BASE_URL}/resume/user/${userId}`;
    }
    
const res = await axios.get(url);
// Go APIのレスポンスをGraphQLのResume型に変換
return res.data.map((item: any) => ({
  id: item.id,
  userId: item.user_id,
  title: item.title,
  description: item.summary ?? item.description ?? '', // summary優先、なければdescription
  date: item.date ?? item.created_at ?? '', // date優先、なければcreated_at
  skills: Array.isArray(item.skills)
    ? item.skills // SkillDTO[]をそのまま渡す
    : [],
  verified: !!item.verified,
  createdAt: item.created_at ?? '',
  updatedAt: item.updated_at ?? '',
}));
  }

  async createResume(resume: any) {
    const res = await axios.post(`${BASE_URL}/resume`, resume);
    return res.data;
  }

  async getResume(id: number) {
    const url = `${BASE_URL}/resume/${id}`;
    const res = await axios.get(url);
    const data = res.data;
    // user_id → userId へ変換
    return {
      ...data,
      userId: data.user_id,
      description: data.summary ?? "",
      date: data.date ?? "",
      verified: data.verified ?? false,
      createdAt: data.createdAt ?? "",
      updatedAt: data.updatedAt ?? "",
    };
  }
}

// --- 追加: id→name変換用のマスターデータを保持するグローバル変数 ---
let globalOsList: { id: number, name: string }[] = [];
let globalToolsList: { id: number, name: string }[] = [];
let globalLanguagesList: { id: number, name: string }[] = [];

// マスターデータをセットする関数
export function setMasterLists(osList: any[], toolsList: any[], languagesList: any[]) {
  globalOsList = osList;
  globalToolsList = toolsList;
  globalLanguagesList = languagesList;
}

// id→name変換
function findMasterName(id: number, list: { id: number, name: string }[]) {
  const found = list.find(x => x.id === id);
  return found ? found.name : String(id);
}