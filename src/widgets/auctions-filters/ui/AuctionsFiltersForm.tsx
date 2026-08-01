import { type KeyboardEvent } from "react";
import {
  type AuctionsFilterPatch,
  type AuctionsSearchParams,
  hasActiveAuctionFilters,
} from "@/features/filter-auctions";
import { CITY_NAMES } from "@/shared/config";
import { Button, Input } from "@/shared/ui";
import {
  BOOLEAN_FILTER_OPTIONS,
  CHECKBOX_FILTER_FIELDSETS,
  CITY_FILTER_SELECTS,
  DATE_RANGE_FILTERS,
  NUMBER_RANGE_FILTERS,
} from "../model/auctions-filters.config";
import { useAuctionsFiltersForm } from "../model/use-auctions-filters-form";
import { BooleanFilterGroup } from "./BooleanFilterGroup";
import { CheckboxFilterFieldset } from "./CheckboxFilterFieldset";
import { CityFilterSelect } from "./CityFilterSelect";
import { DateRangeFilter } from "./DateRangeFilter";
import { FilterField } from "./FilterField";
import { FilterSection } from "./FilterSection";
import { NumberRangeFilter } from "./NumberRangeFilter";

export type AuctionsFiltersFormProps = {
  filters: AuctionsSearchParams;
  setFilters: (patch: AuctionsFilterPatch) => void;
  resetFilters: () => void;
};

const handleEnterFlush = (
  flush: () => void,
  event: KeyboardEvent<HTMLInputElement>,
): void => {
  if (event.key !== "Enter") return;

  event.preventDefault();
  flush();
};

export const AuctionsFiltersForm = ({
  filters,
  setFilters,
  resetFilters,
}: AuctionsFiltersFormProps) => {
  const { cargoNumId, cargoNum, numberRangeFields } = useAuctionsFiltersForm({
    filters,
    setFilters,
  });
  const hasActiveFilters = hasActiveAuctionFilters(filters);

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
      }}
      className="flex flex-col gap-5"
      aria-label="Фильтры аукционов"
    >
      <FilterSection>
        <FilterField label="Номер заявки" id={cargoNumId}>
          <Input
            id={cargoNumId}
            value={cargoNum.value}
            type="text"
            inputMode="numeric"
            onChange={(event) => {
              cargoNum.onChange(event.target.value.replace(/\D/g, ""));
            }}
            onBlur={cargoNum.flush}
            onKeyDown={(event) => {
              handleEnterFlush(cargoNum.flush, event);
            }}
            placeholder="00000000501"
          />
        </FilterField>
      </FilterSection>

      {CHECKBOX_FILTER_FIELDSETS.map((fieldset) => (
        <FilterSection key={fieldset.key}>
          <CheckboxFilterFieldset
            legend={fieldset.legend}
            idPrefix={fieldset.idPrefix}
            options={fieldset.options}
            selectedValues={filters[fieldset.key]}
            onChange={(values) => {
              setFilters({ [fieldset.key]: values });
            }}
          />
        </FilterSection>
      ))}

      <FilterSection key="cities">
        <fieldset className="flex flex-col gap-5 border-0 p-0">
          {CITY_FILTER_SELECTS.map((cityFilter) => (
            <CityFilterSelect
              key={cityFilter.key}
              label={cityFilter.label}
              value={filters[cityFilter.key]}
              cities={CITY_NAMES}
              onChange={(city) => {
                setFilters({ [cityFilter.key]: city });
              }}
            />
          ))}
        </fieldset>
      </FilterSection>

      {DATE_RANGE_FILTERS.map((dateRange) => (
        <FilterSection key={dateRange.key}>
          <DateRangeFilter
            fromLabel={dateRange.fromLabel}
            toLabel={dateRange.toLabel}
            fromValue={filters[dateRange.fromKey]}
            toValue={filters[dateRange.toKey]}
            onFromChange={(value) => {
              setFilters({ [dateRange.fromKey]: value });
            }}
            onToChange={(value) => {
              setFilters({ [dateRange.toKey]: value });
            }}
          />
        </FilterSection>
      ))}

      {NUMBER_RANGE_FILTERS.map((numberRange) => {
        const rangeFields = numberRangeFields[numberRange.key];

        return (
          <FilterSection key={numberRange.key}>
            <NumberRangeFilter
              fromLabel={numberRange.fromLabel}
              toLabel={numberRange.toLabel}
              fromValue={rangeFields.fromValue}
              toValue={rangeFields.toValue}
              onFromChange={rangeFields.onFromChange}
              onToChange={rangeFields.onToChange}
              onFromBlur={rangeFields.flushFrom}
              onToBlur={rangeFields.flushTo}
            />
          </FilterSection>
        );
      })}

      <FilterSection>
        <BooleanFilterGroup
          options={BOOLEAN_FILTER_OPTIONS}
          filters={filters}
          onToggle={(key, value) => {
            setFilters({ [key]: value });
          }}
        />
      </FilterSection>

      <Button
        type="button"
        variant="outline"
        onClick={resetFilters}
        disabled={!hasActiveFilters}
      >
        Сбросить фильтры
      </Button>
    </form>
  );
};
