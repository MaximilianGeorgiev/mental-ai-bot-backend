import { ValidRoutes } from "src/types/enums/service-calls.enum";
import { ServiceOperationOutcome } from "src/types/interfaces/api-response";

export const isStringPresentInEnum = (
  searchValue: string,
  enumToSearch: any,
  partialMatch: boolean = false,
): boolean => {
  if (partialMatch) {
    return Object.values(enumToSearch).some((value: any) =>
      value.includes(searchValue),
    );
  } else {
    return Object.values(enumToSearch).includes(searchValue);
  }
};

export const extractApiCallCategory = (
  url: string,
): ServiceOperationOutcome => {
  try {
    const categorySubString = url.split("/")[2];

    if (isStringPresentInEnum(categorySubString, ValidRoutes)) {
      return { success: true, message: `${categorySubString}Service` };
    }
  } catch (err) {
    return { success: false, message: err };
  }

  return { success: false, message: "Operation failed." };
};
