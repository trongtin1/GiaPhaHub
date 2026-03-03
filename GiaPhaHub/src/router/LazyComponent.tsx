import React, { Suspense } from "react";
import ContentSkeleton from "@/components/common/Skeleton";

interface LazyComponentProps {
  component: React.ComponentType;
}

const LazyComponent: React.FC<LazyComponentProps> = ({ component }) => {
  const Component = component;
  return (
    <Suspense fallback={<ContentSkeleton loading>{null}</ContentSkeleton>}>
      <Component />
    </Suspense>
  );
};

export default LazyComponent;
