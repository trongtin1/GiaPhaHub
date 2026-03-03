import { Skeleton } from "antd";
import type { ReactNode } from "react";

interface ContentSkeletonProps {
  loading: boolean;
  children: ReactNode;
  rows?: number;
  avatar?: boolean;
}

const ContentSkeleton: React.FC<ContentSkeletonProps> = ({
  loading,
  children,
  rows = 6,
  avatar = false,
}) => {
  return (
    <Skeleton active loading={loading} avatar={avatar} paragraph={{ rows }}>
      {children}
    </Skeleton>
  );
};

export default ContentSkeleton;
