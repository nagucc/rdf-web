import { request } from '@umijs/max';

export async function fakeSubmitForm(params: any) {
  return request('https://10-10-160-92-13001.webvpn.ynu.edu.cn/v1/triple/182', {
    method: 'GET',
  });
}
