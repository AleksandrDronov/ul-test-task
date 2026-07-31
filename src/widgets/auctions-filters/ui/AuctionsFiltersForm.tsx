import { type AuctionsSearchParams } from "@/features/filter-auctions/model/auctions-search-params.schema";
import { type AuctionsFilterPatch } from "@/features/filter-auctions/model/use-auctions-filters";
import { CITY_NAMES } from "@/shared/api/msw/cities";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
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

export const AuctionsFiltersForm = ({
  filters,
  setFilters,
  resetFilters,
}: AuctionsFiltersFormProps) => {
  const {
    cargoNumId,
    cargoNum,
    setCargoNum,
    priceFrom,
    setPriceFrom,
    priceTo,
    setPriceTo,
    applyImmediate,
  } = useAuctionsFiltersForm({ filters, setFilters });

  return (
    <form
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
            value={cargoNum}
            type="number"
            inputMode="decimal"
            min={0}
            onChange={(event) => {
              setCargoNum(event.target.value);
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
              applyImmediate({ [fieldset.key]: values });
            }}
          />
        </FilterSection>
      ))}

      <FilterSection>
        <div className="flex flex-col gap-5">
          {CITY_FILTER_SELECTS.map((cityFilter) => (
            <CityFilterSelect
              key={cityFilter.key}
              label={cityFilter.label}
              value={filters[cityFilter.key]}
              cities={CITY_NAMES}
              onChange={(city) => {
                applyImmediate({ [cityFilter.key]: city });
              }}
            />
          ))}
        </div>
      </FilterSection>

      {DATE_RANGE_FILTERS.map((dateRange) => (
        <FilterSection key={dateRange.key}>
          <DateRangeFilter
            fromLabel={dateRange.fromLabel}
            toLabel={dateRange.toLabel}
            fromValue={filters[dateRange.fromKey]}
            toValue={filters[dateRange.toKey]}
            onFromChange={(value) => {
              applyImmediate({ [dateRange.fromKey]: value });
            }}
            onToChange={(value) => {
              applyImmediate({ [dateRange.toKey]: value });
            }}
          />
        </FilterSection>
      ))}

      {NUMBER_RANGE_FILTERS.map((numberRange) => (
        <FilterSection key={numberRange.key}>
          <NumberRangeFilter
            fromLabel={numberRange.fromLabel}
            toLabel={numberRange.toLabel}
            fromValue={priceFrom}
            toValue={priceTo}
            onFromChange={setPriceFrom}
            onToChange={setPriceTo}
          />
        </FilterSection>
      ))}

      <FilterSection>
        <BooleanFilterGroup
          options={BOOLEAN_FILTER_OPTIONS}
          values={{
            is_available: filters.is_available,
            is_bidder: filters.is_bidder,
          }}
          onToggle={(key, value) => {
            applyImmediate({ [key]: value });
          }}
        />
      </FilterSection>

      <Button type="button" variant="outline" onClick={resetFilters}>
        Сбросить фильтры
      </Button>
    </form>
  );
};
