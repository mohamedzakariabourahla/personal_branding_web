import countries from "../data/countries.json";

export interface Country {
  code: string;
  name: string;
}

export function getCountries(): Country[] {
  return countries;
}
