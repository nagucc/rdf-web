import { ITriple } from "nagu-triples-types";

export const TOKEN_KEY = 'jwt_token';

export const RDFS = {
  type: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
  class: 'http://www.w3.org/2000/01/rdf-schema#Class',
}
export const RDF = {
  type: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
  Property:'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property',
}

export const CLI = {
  abbreviatedAs: 'http://ontology.nagu.cc/triples-cil#abbreviatedAs',
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}


/**
 * 将缩写的前缀还原为完整IRI字符串
 * @param value 前缀（含冒号）
 * @param prefixTriples 描述前缀缩写的三元组集合
 * @returns 还原后的完整IRI字符串
 */
export const replacePrefixWithIRI = (value: string, prefixTriples: ITriple[] ): string => {
  const colonIndex = value.indexOf(':');
  // 如果不存在":",原样返回。
  if (colonIndex === -1) return value;

  const pt = prefixTriples.find(t => {
    const p = t.object?.name;
    // 检查value中冒号前的内容是否与prefix相等
    return value.substring(0, colonIndex) === p;
  });
  if (pt) {
    return value.replace(pt.object?.name + ':', pt.subject?.name);
  } else return value;
  
}