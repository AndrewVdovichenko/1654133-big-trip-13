import dayjs from 'dayjs';

export const isPointInPast = (endDate) => {
  return dayjs().isAfter(endDate, `D`);
};

export const isPointInFuture = (startDate) => {
  return dayjs().isBefore(startDate, `D`) || dayjs().isSame(startDate, `D`);
};

export const sortPointDefault = (pointA, pointB) => {
  const startDateA = dayjs(pointA.dates[0]);
  const startDateB = dayjs(pointB.dates[0]);
  return startDateA - startDateB;
};

export const sortPointTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.dates[1]).diff(pointA.dates[0]);
  const durationB = dayjs(pointB.dates[1]).diff(pointB.dates[0]);
  return durationB - durationA;
};

export const sortPointPriceDown = (pointA, pointB) => {
  return pointB.price - pointA.price;
};
