import { PageContainer } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import {
  Card,
  List,
  Modal,
  message,
} from 'antd';
import { type FC } from 'react';
import { Prefix, Triple } from '@/api';
import useStyles from './style.style';
export const BasicList: FC = () => {
  const { styles } = useStyles();
  const {
    data: triples,
    loading,
    mutate,
  } = useRequest(Prefix.list);
  const { run } = useRequest(Triple.delete, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
    }
  });
  
  
  const list = triples || [];
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 5,
    total: list.length,
  };

  return (
    <div>
      <PageContainer>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="基本列表"
            style={{
              marginTop: 24,
            }}
            bodyStyle={{
              padding: '0 32px 40px 32px',
            }}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={(e) => {
                        e.preventDefault();
                        Modal.confirm({
                          title: '删除Prefix',
                          content: '确定删除Prefix定义吗？',
                          okText: '确认',
                          cancelText: '取消',
                          onOk: () => {
                            mutate(list.filter(t => t.id !== item.id));
                            run(item.id);
                          },
                        });
                      }}
                    >
                      删除
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    title={item.object.name}
                    description={item.subject.name}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageContainer>
    </div>
  );
};
export default BasicList;
