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
    items: {
      type: 'os' | 'tools' | 'languages';
      master_id: number;
      name: string;
    }[];
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
          user {
            id
            username
            email
          }
          token
        }
      }
    `;
    const data = await client.request<{ login: { user: { id: number; username: string; email: string }, token: string } }>(mutation, { input: credentials });
    return {
      user: {
        id: data.login.user.id,
        name: data.login.user.username,
        username: data.login.user.username,
        email: data.login.user.email,
        joinDate: new Date().toISOString()
      },
      token: data.login.token
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
  async getResumes(userId?: number) {
    const query = gql`
      query GetResumes($userId: Int) {
        resumes(userId: $userId) {
          id
          userId
          title
          description
          date
          skills {
            items {
              type
              master_id
              name
            }
          }
          verified
          createdAt
          updatedAt
        }
      }
    `;
    const variables = userId !== undefined ? { userId } : {};
    const data = await client.request<{ resumes: Resume[] }>(query, variables);
    // skills型をitems配列のみで扱う
    return data.resumes.map((resume) => ({
      ...resume,
      skills: {
        items: Array.isArray(resume.skills?.items) ? resume.skills.items : []
      }
    }));
  },

  async getResumeById(resumeId: number) {
    const query = gql`
      query GetResume($id: Int!) {
        resume(id: $id) {
          id
          userId
          title
          description
          date
          skills {
            items {
              type
              master_id
              name
            }
          }
          verified
          createdAt
          updatedAt
        }
      }
    `;
    const variables = { id: resumeId };
    const data = await client.request<{ resume: Resume }>(query, variables);
    return data.resume
      ? {
          ...data.resume,
          skills: {
            items: Array.isArray(data.resume.skills?.items) ? data.resume.skills.items : []
          }
        }
      : null;
  },
  async createResume(resumeData: Omit<Resume, 'id' | 'userId' | 'verified' | 'createdAt' | 'updatedAt'>) {
    const mutation = gql`
      mutation CreateResume($input: ResumeInput!) {
        createResume(input: $input)
      }
    `;
    await client.request(mutation, { input: resumeData });
  },
  async updateResume(id: number, resumeData: Omit<Resume, 'id' | 'userId' | 'verified' | 'createdAt' | 'updatedAt'>) {
    const mutation = gql`
      mutation UpdateResume($id: Int!, $input: ResumeInput!) {
        updateResume(id: $id, input: $input)
      }
    `;
    await client.request(mutation, { id, input: resumeData });
  },
  async deleteResume(id: number) {
    const mutation = gql`
      mutation DeleteResume($id: Int!) {
        deleteResume(id: $id)
      }
    `;
    await client.request(mutation, { id });
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
  },
  async getOSList() {
    const query = gql`
      query {
        osList {
          id
          name
        }
      }
    `;
    const data = await client.request<{ osList: { id: number; name: string }[] }>(query);
    return data.osList;
  },
  async getTools() {
    const query = gql`
      query {
        toolsList {
          id
          name
        }
      }
    `;
    const data = await client.request<{ toolsList: { id: number; name: string }[] }>(query);
    return data.toolsList;
  },
  async getLanguages() {
    const query = gql`
      query {
        languagesList {
          id
          name
        }
      }
    `;
    const data = await client.request<{ languagesList: { id: number; name: string }[] }>(query);
    return data.languagesList;
  }
};