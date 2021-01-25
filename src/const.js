export const MINUTES_IN_HOUR = 60;
export const HOURS_IN_DAY = 24;

export const TRIP_POINT_TYPES = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`,
  `Check-in`,
  `Sightseeing`,
  `Restaurant`,
];

export const CITIES = [
  `Moscow`,
  `St. Petersburg`,
  `Yekaterinburg`,
  `Beijing`,
  `Guangzhou`,
  `London`,
  `Berlin`,
  `Amsterdam`,
  `New York`,
  `Dallas`,
  `Austin`,
  `Paris`,
  `Vienna`,
];

export const DESCRIPTION = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

export const OFFERS = {
  'Taxi': [`Order Uber`],
  'Bus': [`Switch to comfort class`],
  'Train': [`Travel by Airlines`, `Switch to comfort class`, `Add meal`],
  'Ship': [`Switch to comfort class`, `Travel by Airlines`, `Rent a yacht`],
  'Transport': [`Order Uber`, `Rent a bicycle`],
  'Drive': [`Rent a car`],
  'Flight': [`Add luggage`, `Choose seats`, `Switch to comfort class`, `Travel by train`, `Add meal`],
  'Check-in': [`Add breakfast`, `Early check-in`, `Late check-out`],
  'Sightseeing': [`Book tickets`, `Lunch in city`, `Buy souvenirs`, `Take a tour guide`],
  'Restaurant': [`Order Uber`, `Add wine`, `Take a music band`],
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`,
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`,
};

export const SortType = {
  DEFAULT: `day`,
  TIME: `time`,
  PRICE: `price`,
};
