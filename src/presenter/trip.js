import SortView from '../view/sort';
import PointListView from '../view/point-list';
import NoPointView from '../view/no-point';
import PointPresenter from '../presenter/point';
import NewPointPresenter from '../presenter/new-point';
import {render, remove, RenderPosition} from '../utils/render';
import {filter} from '../utils/filter';
import {UserAction, UpdateType, FilterType, SortType} from '../const';
import {sortPointDefault, sortPointTime, sortPointPriceDown} from '../utils/point';

export default class Trip {
  constructor(tripContainer, pointsModel, filterModel, offersModel) {
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._pointsPresenters = {};
    this._currentSortType = SortType.DEFAULT;

    this._pointListComponent = new PointListView();
    this._noPointComponent = new NoPointView();
    this._sortComponent = null;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new NewPointPresenter(this._pointListComponent, this._handleViewAction);
  }

  init() {
    render(this._tripContainer, this._pointListComponent, RenderPosition.BEFOREEND);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  createPoint() {
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME:
        filteredPoints.sort(sortPointTime);
        break;
      case SortType.PRICE:
        filteredPoints.sort(sortPointPriceDown);
        break;
      default:
        filteredPoints.sort(sortPointDefault);
    }

    return filteredPoints;
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();

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
        this._pointsModel.addPoint(updateType, update);
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
      case UpdateType.MAJOR:
        this._clearTrip(true);
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._renderTrip();
        break;
    }
  }

  _handlePointChange(updatedPoint) {
    this._pointsModel.updatePoint(updatedPoint);
    this._pointsPresenters[updatedPoint.id].init(updatedPoint);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType !== sortType) {
      this._currentSortType = sortType;
      this._clearTrip();
      this._renderTrip();
    }
  }

  _clearTrip(resetSortType = false) {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointsPresenters)
      .forEach((presenter) => presenter.destroy());
    this._pointsPresenters = {};

    remove(this._sortComponent);
    remove(this._noPointComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoPoints() {
    render(this._tripContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleModeChange, this._handleViewAction, this._offersModel);
    pointPresenter.init(point);
    this._pointsPresenters[point.id] = pointPresenter;
  }

  _renderPoints(points) {
    points.forEach((point) => this._renderPoint(point));
  }

  _renderTrip() {
    const points = this._getPoints();
    const pointCount = points.length;

    if (pointCount === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPoints(points);
  }
}
