import { filterOptions } from "../../components/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";

function ProductFilter({ filters, handleFilter }) {
    return (
      <div className="bg-background rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-extrabold">Filters</h2>
        </div>
        <div className="p-4">
          <Accordion type="multiple">
            {Object.keys(filterOptions).map((keyItem) => (
              <AccordionItem key={keyItem} value={keyItem}>
                <AccordionTrigger>
                  <h3 className="text-base font-bold capitalize">{keyItem}</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2 mt-2">
                    {/* Category filter is simple */}
                    {keyItem === "types" && filters.category?.length > 0 ? (
                      filterOptions[keyItem][filters.category].map((option) => (
                        <Label key={option.id} className="flex font-medium items-center gap-2">
                          <Checkbox
                            checked={
                              filters &&
                              filters[keyItem] &&
                              filters[keyItem].includes(option.id)
                            }
                            onCheckedChange={() => handleFilter(keyItem, option.id)}
                          />
                          {option.label}
                        </Label>
                      ))
                    ) : keyItem === "types" ? (
                      <p className="text-sm text-gray-500">Select a category first</p>
                    ) : (
                      filterOptions[keyItem].map((option) => (
                        <Label key={option.id} className="flex font-medium items-center gap-2">
                          <Checkbox
                            checked={
                              filters &&
                              filters[keyItem] &&
                              filters[keyItem].includes(option.id)
                            }
                            onCheckedChange={() => handleFilter(keyItem, option.id)}
                          />
                          {option.label}
                        </Label>
                      ))
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    );
  }
export default ProductFilter;