import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import React from "react";

interface BreadcrumbItem {
  title: string;
  link?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
}

const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ items }) => {
  const breadcrumbItems = items.map((item, index) => ({
    title: item.link ? (
      <Link to={item.link}>
        <span className="capitalize text-gray-400 hover:text-amber-600 transition-colors duration-200">
          {item.title}
        </span>
      </Link>
    ) : (
      <span className="capitalize font-medium text-gray-700 transition-colors duration-200">
        {item.title}
      </span>
    ),
    key: index,
  }));

  return <Breadcrumb items={breadcrumbItems} className="mb-4" />;
};

export default PageBreadcrumb;
