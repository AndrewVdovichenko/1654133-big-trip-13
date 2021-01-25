import dayjs from 'dayjs';
import EditPointView from '../view/edit-point';
import {render, remove, RenderPosition} from '../utils/render';
import {getRandomOffers, getRandomImages} from '../utils/tools';
import {TRIP_POINT_TYPES, UserAction, UpdateType} from '../const';
import {nanoid} from 'nanoid';

const BLANK_POINT = {
  type: ``,//TRIP_POINT_TYPES[0],
  city: ``,
  description: ``,
  offers: getRandomOffers(TRIP_POINT_TYPES[0]),
  price: ``,
  images: getRandomImages(),
  dates: [dayjs().toDate(), dayjs().toDate()],
  isFavorite: false,
};

export default class NewPoint {
  constructor(pointListContainer, changeData) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;

    this._editPointComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
  }

  init() {
    if (this._editPointComponent === null) {
      this._editPointComponent = new EditPointView(BLANK_POINT, true);

      this._editPointComponent.setSubmitFormClick(this._handleFormSubmit);
      this._editPointComponent.setDeleteClick(this._handleCancelClick);
      this._editPointComponent.setCloseFormClick(this._handleCancelClick);

      render(this._pointListContainer, this._editPointComponent, RenderPosition.AFTERBEGIN);

      document.addEventListener(`keydown`, this._handleEscKeyDown);
    }
  }

  destroy() {
    if (this._editPointComponent !== null) {
      if (this._destroyCallback !== null) {
        this._destroyCallback();
      }

      remove(this._editPointComponent);
      this._editPointComponent = null;

      document.removeEventListener(`keydown`, this._handleEscKeyDown);
    }
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        Object.assign({id: nanoid()}, point)
    );

    this.destroy();
  }

  _handleCancelClick() {
    this.destroy();
  }

  _handleEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
