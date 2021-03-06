import SwitchesView from './view/switches';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import SummaryPresenter from './presenter/summary';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import {generateTripPoint} from './mock/point';
import {render, RenderPosition} from './utils/render';
import Api from './api';
import { UpdateType } from './const';

const AUTHORIZATION = `Basic aasdflkja9087qweij`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip/`;
const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();

const tripMainHandler = document.querySelector(`.trip-main`);
const tripControlsHandler = tripMainHandler.querySelector(`.trip-controls`);
const tripSwitchesHandler = tripControlsHandler.querySelector(`.visually-hidden`);

render(tripSwitchesHandler, new SwitchesView(), RenderPosition.AFTERBEGIN);

const summaryPresenter = new SummaryPresenter(tripMainHandler, pointsModel);
summaryPresenter.init();

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(tripControlsHandler, filterModel, pointsModel);
filterPresenter.init();

const tripEventsElement = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel);
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});

api.getPoints().then((points) => {
  pointsModel.setPoints(UpdateType.INIT, points);
});
