import { GraphQLClient, gql } from 'graphql-request';

export interface User {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  username?: string;
}

export interface Resume {
  id: number;
  userId: number;
  title: string;
  description: string;
  date: string;
  skills: {
    os: string[];
    tools: string[];
    languages: string[];
  };
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  summary?: string;
  experiences?: any[];
}

const endpoint = process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:3001/graphql';
const client = new GraphQLClient(endpoint);

export const authApi = {
  async login(credentials: { email: string; password: string }) {
    const mutation = gql`
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          id
          username
          email
        }
      }
    `;
    const data = await client.request<{ login: { id: number; username: string; email: string } }>(mutation, { input: credentials });
    return {
      user: {
        id: data.login.id,
        name: data.login.username,
        email: data.login.email,
        joinDate: ''
      },
      token: 'dummy-token'
    };
  },
  async getProfile() {
    const query = gql`
      query {
        me {
          id
          username
          email
        }
      }
    `;
    const data = await client.request<{ me: { id: number; username: string; email: string } }>(query);
    return {
      id: data.me.id,
      name: data.me.username,
      email: data.me.email,
      joinDate: ''
    };
  }
};

export const resumeApi = {
  async getResumes() {
    const query = gql`
      query {
        resumes {
          id
          userId
          title
          description
          date
          skills { os tools languages }
          verified
          createdAt
          updatedAt
        }
      }
    `;
    const data = await client.request<{ resumes: Resume[] }>(query);
    return data.resumes;
  },
  async createResume(resumeData: Omit<Resume, 'id' | 'userId' | 'verified' | 'createdAt' | 'updatedAt'>) {
    const mutation = gql`
      mutation CreateResume($input: ResumeInput!) {
        createResume(input: $input) {
          id
          userId
          title
          description
          date
          skills { os tools languages }
          verified
          createdAt
          updatedAt
        }
      }
    `;
    const data = await client.request<{ createResume: Resume }>(mutation, { input: resumeData });
    return data.createResume;
  },
  async updateResume(id: number, resumeData: Omit<Resume, 'id' | 'userId' | 'verified' | 'createdAt' | 'updatedAt'>) {
    // 仮実装: BFFにupdateResume mutationが必要
    return {} as Resume;
  },
  async deleteResume(id: number) {
    // 仮実装: BFFにdeleteResume mutationが必要
    return;
  }
};

export const skillApi = {
  async getSkills() {
    const query = gql`
      query {
        skills { type masterId level years }
      }
    `;
    const data = await client.request<{ skills: string[] }>(query);
    return data.skills;
  }
};