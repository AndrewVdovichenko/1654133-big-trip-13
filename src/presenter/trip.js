import SortView from '../view/events-sort-form';
import PointListView from '../view/point-list';
import NoPointView from '../view/no-point';
import PointPresenter from '../presenter/point';
import {render, remove, RenderPosition} from '../utils/render';
import {UserAction, UpdateType} from '../const';

export default class Trip {
  constructor(tripContainer, pointsModel) {
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._pointsPresenters = {};

    this._sortComponent = null;
    this._pointListComponent = new PointListView();
    this._noPointComponent = new NoPointView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    render(this._tripContainer, this._pointListComponent, RenderPosition.BEFOREEND);

    this._pointsModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  _handleModeChange() {
    Object.values(this._pointsPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointsPresenters[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
    }
  }

  _handlePointChange(updatedPoint) {
    this._pointsModel.updatePoint(updatedPoint);
    this._pointsPresenters[updatedPoint.id].init(updatedPoint);
  }

  _clearTrip() {
    Object
      .values(this._pointsPresenters)
      .forEach((presenter) => presenter.destroy());
    this._pointsPresenters = {};

    remove(this._sortComponent);
  }

  _renderSort() {
    this._sortComponent = new SortView();
    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoPoints() {
    render(this._tripContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleModeChange, this._handleViewAction);
    pointPresenter.init(point);
    this._pointsPresenters[point.id] = pointPresenter;
  }

  _renderPoints() {
    this._pointsModel.getPoints().forEach((point) => this._renderPoint(point));
  }

  _renderTrip() {
    const pointCount = this._pointsModel.getPoints().length;

    if (pointCount === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPoints();
  }
}
