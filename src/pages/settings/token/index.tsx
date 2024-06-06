import {
  PageContainer,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { Card, message } from 'antd';
import type { FC } from 'react';
import { TOKEN_KEY, setToken } from '@/utils';
import { useModel } from '@umijs/max';

const BasicForm: FC<Record<string, any>> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const onFinish = async (values: Record<string, any>) => {
    setToken(values.token);
    setInitialState({
      ...initialState,
      currentUser: { name: 'itc-token' },
    })
    const urlParams = new URL(window.location.href).searchParams;
    window.location.href = urlParams.get('redirect') || '/';
    // message.success('提交成功');
  };
  return (
    <PageContainer content="修改服务器token">
      <Card bordered={false}>
        <ProForm
          style={{
            margin: 'auto',
            marginTop: 8,
            maxWidth: 600,
          }}
          name="basic"
          layout="vertical"
          initialValues={{
            token: localStorage.getItem(TOKEN_KEY),
          }}
          onFinish={onFinish}
        >
          <ProFormText
            width="md"
            label="Token"
            name="token"
            rules={[
              {
                required: true,
                message: '请输入token',
              },
            ]}
            placeholder="请输入token"
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};
export default BasicForm;
