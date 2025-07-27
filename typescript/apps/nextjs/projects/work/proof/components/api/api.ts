import { GraphQLClient, gql } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:3001/graphql';
const client = new GraphQLClient(endpoint);

export const authApi = {
  async login(credentials: { email: string; password: string }) {
    const mutation = gql\`
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          id
          username
          email
        }
      }
    \`;
    const data = await client.request(mutation, { input: credentials });
    return data.login;
  },
  async getProfile() {
    const query = gql\`
      query {
        me {
          id
          username
          email
        }
      }
    \`;
    const data = await client.request(query);
    return data.me;
  }
};

export const resumeApi = {
  async getResumes() {
    const query = gql\`
      query {
        resumes {
          userId
          title
          summary
          skills { type masterId level years }
          experiences { company position startDate endDate description portfolioUrl }
        }
      }
    \`;
    const data = await client.request(query);
    return data.resumes;
  },
  async createResume(resumeData: any) {
    const mutation = gql\`
      mutation CreateResume($input: ResumeInput!) {
        createResume(input: $input) {
          userId
          title
          summary
          skills { type masterId level years }
          experiences { company position startDate endDate description portfolioUrl }
        }
      }
    \`;
    const data = await client.request(mutation, { input: resumeData });
    return data.createResume;
  }
};

export const skillApi = {
  async getSkills() {
    const query = gql\`
      query {
        skills { type masterId level years }
      }
    \`;
    const data = await client.request(query);
    return data.skills;
  }
};