import React, { Suspense } from "react";
import PageLoading from "@/components/common/PageLoading";

interface LazyComponentProps {
  component: React.ComponentType;
}

const LazyComponent: React.FC<LazyComponentProps> = ({ component }) => {
  const Component = component;
  return (
    <Suspense fallback={<PageLoading />}>
      <Component />
    </Suspense>
  );
};

export default LazyComponent;
