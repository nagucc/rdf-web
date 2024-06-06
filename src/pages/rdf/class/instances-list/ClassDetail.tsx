import { Resource } from "@/api";
import { useRequest } from "@umijs/max";
import { Card, Typography } from "antd";
import { FC, useEffect } from "react";

const { Title } = Typography;
export type ClassDetailCardProps = {
  iri: string|undefined,
  label?: string,
  comment?: string,
}
const ClassDetailCard: FC<ClassDetailCardProps> = (props) => {
  const { iri } = props;
  const { data: detail, run, loading } = useRequest(() => {
    return Resource.get(iri);
  }, {
    manual: true,
  })
  useEffect(() => {
    run();
  }, [iri]);
  return (
    <Card bordered={false} loading={loading}>
      <Title level={5}>{detail?.label || props.iri}</Title>
      <p>{detail?.comment}</p>
    </Card>
  )
}
export default ClassDetailCard;
