import dayjs from 'dayjs';

import SmartView from './smart';

import {CITIES, OFFERS} from '../const';
import {getRandomInteger, getRandomDescription, getRandomImages} from '../utils/tools';

import EventTypes from './event-types';

function getIdFromOffer([title, price]) {
  return `${title.replaceAll(` `, `-`)}-${price}`;
}

function getOfferFromId(id) {
  const newId = id.slice().split(`-`);
  newId.shift();
  newId.shift();

  const price = parseInt(newId.pop(), 10);
  const title = newId.join(` `);

  return [title, price];
}

function createOffersTemplate(offers, type) {
  const availableOffers = [];//OFFERS[type];
  if (availableOffers.length === 0) {
    return ``;
  }

  let template = ``;

  for (const offer of availableOffers) {
    const price = offers[offer] || getRandomInteger(10, 100);
    const offerId = getIdFromOffer([offer, price]);
    template += `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerId}" type="checkbox" name="event-offer-${offerId}" ${Object.keys(offers).includes(offer) ? `checked` : ``}>
    <label class="event__offer-label" for="event-offer-${offerId}">
        <span class="event__offer-title">${offer}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
    </label>
    </div>`;
  }

  return `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">${template}</div>
  </section>`;
}

function createImagesTemplate(images) {
  return images.length
    ? `<div class="event__photos-container">
        <div class="event__photos-tape">
        ${images.map(([image, description]) => `<img class="event__photo" src="${image}" alt="${description}">`).join(``)}
        </div>
      </div>`
    : ``;
}

function createDescriptionTemplate(description, images) {
  return description.length
    ? `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>
          ${createImagesTemplate(images)}
        </section>`
    : ``;
}

function createEditPoint(data, isNewPoint) {
  const {type, city, description, price, dates, offers, images} = data;
  const startDate = dayjs(dates[0]).format(`DD/MM/YY HH:mm`);
  const endDate = dayjs(dates[1]).format(`DD/MM/YY HH:mm`);

  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          ${new EventTypes().getTemplate()}
          </div>

          <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
          <datalist id="destination-list-1">
              ${CITIES.map((value) => `<option value="${value}"></option>`)}
          </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
          </div>

          <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${isNewPoint ? `Cancel` : `Delete`}</button>
          <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
  ${createOffersTemplate(offers, type)}

  ${createDescriptionTemplate(description, images)}
        </section>
      </form>
    </li>`;
}

export default class EditPoint extends SmartView {
  constructor(point, isNewPoint = false) {
    super();

    this._data = point;
    this._isNewPoint = isNewPoint;
    this._submitFormHandler = this._submitFormHandler.bind(this);
    this._closeFormHandler = this._closeFormHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._eventTypeHandler = this._eventTypeHandler.bind(this);
    this._eventDestinationHandler = this._eventDestinationHandler.bind(this);
    this._eventPriceHandler = this._eventPriceHandler.bind(this);
    this._offerHandler = this._offerHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditPoint(this._data, this._isNewPoint);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseFormClick(this._callback.closeFormClick);
    this.setSubmitFormClick(this._callback.submitFormClick);
    this.setDeleteClick(this._callback.deleteClick);
  }

  reset(point) {
    this.updateData(point);
  }

  _setInnerHandlers() {
    const element = this.getElement();

    element
      .querySelector(`.event__type-list`)
      .addEventListener(`click`, this._eventTypeHandler);

    element
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._eventDestinationHandler);

    element
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._eventPriceHandler);

    const availableOffers = element.getElementsByClassName(`event__offer-checkbox`);

    for (const offer of availableOffers) {
      offer.addEventListener(`click`, this._offerHandler);
    }
  }

  _submitFormHandler(evt) {
    evt.preventDefault();
    this._callback.submitFormClick(this._data);
  }

  _closeFormHandler(evt) {
    evt.preventDefault();
    this._callback.closeFormClick();
  }

  _eventTypeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.textContent,
      offers: {},
    });
  }

  _eventDestinationHandler(evt) {
    evt.preventDefault();
    const city = evt.target.value;
    if (CITIES.includes(city)) {
      this.updateData({
        city,
        description: getRandomDescription(),
        images: getRandomImages(),
      });
    } else {
      evt.target.value = ``;
      evt.target.placeholder = `Choose city`;

      evt.target.focus();
      evt.target.setCustomValidity(`City not found`);
    }
  }

  _eventPriceHandler(evt) {
    evt.preventDefault();
    const priceInput = evt.target.value;
    const price = priceInput.length > 0 ? parseInt(evt.target.value, 10) : 0;
    this.updateData({price}, false);
  }

  _offerHandler(evt) {
    const [title, price] = getOfferFromId(evt.target.id);

    if (evt.target.checked) {
      this._data.offers[title] = price;
    } else {
      delete this._data.offers[title];
    }
  }

  setSubmitFormClick(callback) {
    this._callback.submitFormClick = callback;
    this.getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, this._submitFormHandler);
  }

  setCloseFormClick(callback) {
    this._callback.closeFormClick = callback;
    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._closeFormHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._data);
  }

  setDeleteClick(callback) {
    this._callback.deleteClick = callback;
    this.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._formDeleteClickHandler);
  }
}
