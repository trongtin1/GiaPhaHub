import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

interface BreadcrumbItemData {
  title: string;
  link?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItemData[];
}

const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ items }) => {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.link ? (
                <BreadcrumbLink asChild>
                  <Link
                    to={item.link}
                    className="capitalize text-gray-400 hover:text-amber-600 transition-colors duration-200"
                  >
                    {item.title}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="capitalize font-medium text-gray-700">
                  {item.title}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageBreadcrumb;
