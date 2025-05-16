import React from "react";
import styles from "./quotes-filters.module.css";
import Input from "@/components/input/input";
import Checkbox from "@/components/checkbox/checkbox";

export type QuotesFiltersType = {
  search: string;
  onlyPositive: boolean;
  onlyNegative: boolean;
};

type QuotesFiltersProps = {
  filters: QuotesFiltersType;
  onFiltersChange: (filters: QuotesFiltersType) => void;
};

export default function QuotesFilters({
  filters,
  onFiltersChange,
}: QuotesFiltersProps) {
  return (
    <div className={styles.quotesFilters}>
      <Input
        placeholder="Поиск"
        value={filters.search}
        onChange={(e) =>
          onFiltersChange({ ...filters, search: e.target.value })
        }
      />
      <Checkbox
        label="Только растущие"
        checked={filters.onlyPositive}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            onlyPositive: e.target.checked,
            onlyNegative: e.target.checked ? false : filters.onlyNegative,
          })
        }
      />
      <Checkbox
        label="Только падающие"
        checked={filters.onlyNegative}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            onlyNegative: e.target.checked,
            onlyPositive: e.target.checked ? false : filters.onlyPositive,
          })
        }
      />
    </div>
  );
}
