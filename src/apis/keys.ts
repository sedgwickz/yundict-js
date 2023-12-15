import { ReadStream } from "fs";
import Yundict from "..";
import { ProjectKey, ProjectResourceQuery } from "../types/project";
import { APIResponse } from "../types/response";

interface FetchProjectKeysParams {
  keyword?: string;
  tags?: string[];
  sort?: string;
  page?: number;
  limit?: number;
}

export default class Keys {

  client: Yundict;

  constructor(client: Yundict) {
    this.client = client;
  }

  async all({ team, project, ...args }: ProjectResourceQuery & FetchProjectKeysParams) {
    const { keyword, tags, sort, page = 1, limit = 20 } = args ?? {}
    const params = new URLSearchParams()
    if (keyword) params.append('keyword', keyword)
    if (tags) params.append('tags', tags.join(','))
    if (sort) params.append('sort', sort)
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    const res = await this.client.request(`/teams/${team}/projects/${project}/keys?${params.toString()}`);
    return res as APIResponse<{ keys: ProjectKey[], total: number }>;
  }

  async create({ team, project }: ProjectResourceQuery, data: ProjectKey) {
    return (await this.client.request(`/teams/${team}/projects/${project}/keys`, {
      method: 'POST',
      body: JSON.stringify(data)
    })) as APIResponse<ProjectKey[]>;
  }

  async update({ team, project, key }: ProjectResourceQuery & { key: string }, data: ProjectKey) {
    return (await this.client.request(`/teams/${team}/projects/${project}/keys/${key}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })) as APIResponse<ProjectKey>;
  }

  async delete({ team, project, key }: ProjectResourceQuery & { key: string }) {
    return (await this.client.request(`/teams/${team}/projects/${project}/keys/${key}`, { method: 'DELETE' })) as APIResponse;
  }

  async export({ team, project, ...args }: ProjectResourceQuery & {
    languages?: string[];
    tags?: string[];
    type: string
  }) {
    const { languages, tags, type } = args ?? {}
    const params = new URLSearchParams()
    if (languages && languages.length > 0) params.append('languages', languages.join(','))
    if (tags && tags.length > 0) params.append('tags', tags.join(','))
    if (type) params.append('type', type)
    const res = await this.client.request(`/teams/${team}/projects/${project}/keys/export?${params.toString()}`);
    return res as APIResponse<string>;
  }

  async import({ team, project, language, file, fileName, tags = [], overwrite = false }: ProjectResourceQuery & {
    language: string;
    tags?: string[];
    overwrite?: boolean;
    file: File | Blob;
    fileName: string;
  }) {
    const formData = new FormData();
    formData.set('tags', tags.join(','));
    formData.set('language', language);
    formData.set('overwrite', overwrite.toString());
    formData.append('file', file, fileName);
    const res = await this.client.request(`/teams/${team}/projects/${project}/keys/import`, {
      method: 'POST',
      body: formData,
    });
    return res as APIResponse<{ total: number }>;
  }

}