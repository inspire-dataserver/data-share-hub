
import { useState, useEffect } from "react";
import DatasetCard, { DatasetCardProps } from "./DatasetCard";

interface DatasetGridProps {
  datasets: DatasetCardProps[];
  featuredDatasets?: DatasetCardProps[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const DatasetGrid = ({
  datasets,
  featuredDatasets = [],
  columns = 3,
  className,
}: DatasetGridProps) => {
  const [visibleElements, setVisibleElements] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            setVisibleElements((prev) => [...prev, entry.target as HTMLElement]);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".fade-in-section");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [datasets, featuredDatasets]);

  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={className}>
      {featuredDatasets.length > 0 && (
        <div className="grid grid-cols-1 gap-6 mb-10">
          {featuredDatasets.map((dataset) => (
            <div key={dataset.id} className="fade-in-section">
              <DatasetCard {...dataset} featured={true} />
            </div>
          ))}
        </div>
      )}

      <div className={`grid ${columnClasses[columns]} gap-6`}>
        {datasets.map((dataset) => (
          <div key={dataset.id} className="fade-in-section">
            <DatasetCard {...dataset} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatasetGrid;
