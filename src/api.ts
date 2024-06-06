
import { request } from '@umijs/max';
import { AnnotationProps } from 'nagu-owl-types';
import { CLI } from './utils';
import { ITriple } from 'nagu-triples-types';
const host = 'https://10-10-160-92-13001.webvpn.ynu.edu.cn';

export interface LexcialTriple {
  subject: string,
  predicate: string,
  object: string,
}

export type ResourceInstance = {
  iri: string,
  label: string,
  comment: string,
  isDefinedBy: string,
  seeAlso: string,
}

export type TripleListResult = {
  ret?: number,
  data: ITriple[],
}
export const Triple = {
  create: async function (data: LexcialTriple) {
    return request(`${host}/v1/triple/`, {
      method: 'PUT',
      data,
    });
  },
  delete: async function (id: number) {
    return request(`${host}/v1/triple/${id}`, {
      method: 'DELETE',
    });
  },
  list: async function (triple: any = {}) {
    const { subject, predicate, object } = triple;
    if (!subject && !predicate && !object) return Promise.resolve([]);
    let url = `${host}/v1`;
    if (subject) url += `/subject/${encodeURIComponent(subject)}`;
    if (predicate) url += `/predicate/${encodeURIComponent(predicate)}`;
    if (object) url += `/object/${encodeURIComponent(object)}`;
    return request(url);
  },
  listByP: async function (predicate: string): Promise<TripleListResult> {
    return request(`${host}/v1/predicate/${encodeURIComponent(predicate)}`);
  }
}

export const Prefix  = {
  list: async function (): Promise<{ data: ITriple[] }> {
    const predicate = encodeURIComponent(CLI.abbreviatedAs);
    return request(`${host}/v1/predicate/${predicate}`);
  },
  add: async function(prefix: string, iri: string) {
    return Triple.create({
      subject: iri,
      predicate: CLI.abbreviatedAs,
      object: prefix,
    });
  },
  delete: async function(tripleId: number) {
    return Triple.delete(tripleId);
  }
}

export const Resource = {
  get: async (iri:string) => {
    return request(`${host}/v1/rdf/resource/${encodeURIComponent(iri)}`)
  },
  getPropertyValues: async (iri:string, piri:string):Promise<any[]> => {
    const r = encodeURIComponent(iri);
    const p = encodeURIComponent(piri);
    return request<any[]>(`/v1/rdf/resource/${r}/property/${p}/value`);
  },
  setPropertyValue: async (iri:string, piri:string, value:string):Promise<any> => {
    const r = encodeURIComponent(iri);
    const p = encodeURIComponent(piri);
    return request<any[]>(`/v1/rdf/resource/${r}/property/${p}`, {
      method: 'POST',
      data: { value },
    });
  },
  add: async function (iri: string, data:AnnotationProps) {
    return request(`${host}/v1/rdf/resource/${encodeURIComponent(iri)}`, {
      method: 'PUT',
      data,
    });
  },
  update: async (iri:string, data: AnnotationProps) => {
    return request(`${host}/v1/rdf/resource/${encodeURIComponent(iri)}`, {
      method: 'POST',
      data,
    });
  },
  removeType: async (iri: string, type: string) => {
    return request(`${host}/v1/rdf/resource/${encodeURIComponent(iri)}/remove-type`, {
      method: 'POST',
      data: { type },
    });
  }
}

export const Class = {
  instancesOf: async (iri:string) => {
    return request(`${host}/v1/rdf/class/${encodeURIComponent(iri)}/instances`);
  },
  add: async (data:any) => {
    return request(`${host}/v1/rdf/class/${encodeURIComponent(data.iri)}`,{
      method: 'PUT',
      data,
    });
  },
  delete: async (iri:string) => request(`${host}/v1/rdf/class/${encodeURIComponent(iri)}`,{
    method: 'DELETE',
  }),
}

export const Property = {
  delete: async (iri:string) => request(`${host}/v1/rdf/property/${encodeURIComponent(iri)}`,{
    method: 'DELETE',
  }),
}

export const User = {
  current: async () => request(`${host}/v1/user`),
}
