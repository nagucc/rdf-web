import {
  useState, type FC } from 'react';
import {
  Button,
  Tabs,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export type PropertyValuesTabProps = {
  iri: string,
  pvss: object,
}

const PropertyValuesTab: FC<PropertyValuesTabProps> = (props: PropertyValuesTabProps) => {
  const operations = <Button type='primary' ><PlusOutlined />添加属性值</Button>;
  const items = Object.keys(props.pvss).map((piri,i) => {
    return {
      label: piri,
      key: i.toString(),
      children: <div>key</div>
    }
  });
  return (
    <Tabs tabBarExtraContent={operations} items={items} />
  );
};
export default PropertyValuesTab;