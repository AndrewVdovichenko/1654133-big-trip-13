import TripInfo from './view/trip-info';
import Switches from './view/switches';
import Filters from './view/filters';
import EventsSortForm from './view/events-sort-form';
import Events from './view/events';
import {generateTripPoint} from './mock/point';
import {render, renderPoint, RenderPosition} from './utils';

const TRIP_POINTS = 20;
const tripPoints = new Array(TRIP_POINTS).fill().map(generateTripPoint);
tripPoints.sort(function(a,b) {
  return a.dates[0] - b.dates[0];
});

const tripMainHandler = document.querySelector('.trip-main');
const tripControlsHandler = tripMainHandler.querySelector('.trip-controls');
const tripSwitchesHandler = tripControlsHandler.querySelector('.visually-hidden');
render(tripMainHandler, new TripInfo(tripPoints).getElement(), RenderPosition.AFTERBEGIN);
render(tripSwitchesHandler, new Switches().getElement(), RenderPosition.AFTERBEGIN);
render(tripControlsHandler, new Filters().getElement(), RenderPosition.BEFOREEND);

const tripEventsHandler = document.querySelector('.trip-events');
render(tripEventsHandler, new EventsSortForm().getElement(), RenderPosition.BEFOREEND);
render(tripEventsHandler, new Events().getElement(), RenderPosition.BEFOREEND);

const tripEventsListHandler = document.querySelector('.trip-events__list');

for (const point of tripPoints) {
  renderPoint(tripEventsListHandler, point);
}
