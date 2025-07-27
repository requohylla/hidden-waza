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
    const res = await axios.post(`${BASE_URL}/login`, { email, password });
    return res.data;
  }

  async register(username: string, email: string, password: string) {
    const res = await axios.post(`${BASE_URL}/signup`, { username, email, password });
    return res.data;
  }

  async getResumes() {
    const res = await axios.get(`${BASE_URL}/resumes`);
    return res.data;
  }

  async createResume(resume: any) {
    const res = await axios.post(`${BASE_URL}/resumes`, resume);
    return res.data;
  }
}