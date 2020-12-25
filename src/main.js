import {createTripInfo} from './view/trip-info';
import Switches from './view/switches';
import Filters from './view/filters';
import EventsSortForm from './view/events-sort-form';
import Events from './view/events';
import {createAddNewPoint} from './view/add-new-point';
import {createEditPoint} from './view/edit-point';
import {createTripPoint} from './view/point';
import {generateTripPoint} from './mock/point';

const TRIP_POINTS = 20;

const tripPoints = new Array(TRIP_POINTS).fill().map(generateTripPoint);
tripPoints.sort(function(a,b) {
  return a.dates[0] - b.dates[0];
});

const tripMainHandler = document.querySelector('.trip-main');
const tripControlsHandler = tripMainHandler.querySelector('.trip-controls');
const tripSwitchesHandler = tripControlsHandler.querySelector('.visually-hidden');
render(tripMainHandler, createTripInfo(tripPoints), 'afterbegin');
render(tripSwitchesHandler, new Switches().getTemplate(), 'afterend');
render(tripControlsHandler, new Filters().getTemplate(), 'beforeend');

const tripEventsHandler = document.querySelector('.trip-events');
render(tripEventsHandler, new EventsSortForm().getTemplate(), 'beforeend');
render(tripEventsHandler, new Events().getTemplate(), 'beforeend');

const tripEventsListHandler = document.querySelector('.trip-events__list');
render(tripEventsListHandler, createEditPoint(tripPoints[0]), 'beforeend');

for (let i = 1; i < TRIP_POINTS; i++) {
    render(tripEventsListHandler, createTripPoint(tripPoints[i]), 'beforeend');
}

function render(container, template, place) {
    container.insertAdjacentHTML(place, template);
}
