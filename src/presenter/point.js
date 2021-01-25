import PointView from '../view/point';
import EditPointView from '../view/edit-point';
import {render, replace, remove, RenderPosition} from '../utils/render';
import {UserAction, UpdateType} from '../const';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
};

export default class Point {
  constructor(pointListContainer, changeMode, changeData, offers) {
    this._pointListContainer = pointListContainer;
    this._changeMode = changeMode;
    this._changeData = changeData;
    this._offers = offers;

    this._pointComponent = null;
    this._editPointComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCloseFormClick = this._handleCloseFormClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._editPointComponent;

    this._pointComponent = new PointView(point);
    this._editPointComponent = new EditPointView(point, false, this._offers);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editPointComponent.setSubmitFormClick(this._handleFormSubmit);
    this._editPointComponent.setCloseFormClick(this._handleCloseFormClick);
    this._editPointComponent.setDeleteClick(this._handleDeleteClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._replaceIfExist(this._pointComponent, prevPointComponent);
    this._replaceIfExist(this._editPointComponent, prevPointEditComponent);

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToView();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editPointComponent);
  }

  _replaceIfExist(newComponent, oldComponent) {
    if (this._pointListContainer.getElement().contains(oldComponent.getElement())) {
      replace(newComponent, oldComponent);
    }
  }

  _replaceViewToEdit() {
    replace(this._editPointComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._handleEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditToView() {
    replace(this._pointComponent, this._editPointComponent);
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        point);
    this._replaceEditToView();
  }

  _handleEditClick() {
    this._replaceViewToEdit();
  }

  _handleCloseFormClick() {
    this._editPointComponent.reset(this._point);
    this._replaceEditToView();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}));
  }

  _handleDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._editPointComponent.reset(this._point);
      this._replaceEditToView();
    }
  }
}
