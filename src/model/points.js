import Observer from '../utils/observer';

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  getPoints() {
    return this._points;
  }

  setPoints(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Cannot update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Cannot delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  addPoint(updateType, update) {
    this._points = [update, ...this._points];
    this._points.sort((a, b) => {
      return a.dates[0] - b.dates[0];
    });

    this._notify(updateType, update);
  }

  static adaptToClient(point) {
    return Object.assign(
        {},
        {
          'id': point.id,
          'type': point.type,
          'city': point.destination.name,
          'description': point.destination.description,
          'offers': new Points()._adaptOffersToClient(point.offers),
          'price': point.base_price,
          'images': new Points()._getImages(point.destination.pictures),
          'dates': [point.date_from, point.date_to],
          'isFavorite': point.is_favorite,
        }
    );
  }

  static adaptToServer(point) {
    return Object.assign(
        {},
        {
          'base_price': point.price,
          'date_from': point.dates[0],
          'date_to': point.dates[1],
          'destination': new Points()._adaptDestinationToServer(point),
          'id': point.id,
          'is_favorite': point.isFavorite,
          'offers': new Points()._adaptOffersToServer(point),
          'type': point.type,
        }
    );
  }

  _adaptDestinationToServer(point) {
    const pictures = [];
    for (const image of point.images) {
      pictures.push({
        'src': image[0],
        'description': image[1],
      });
    }

    return {
      'description': point.description,
      'name': point.city,
      pictures,
    };
  }

  _adaptOffersToServer(point) {
    const pointOffers = point.offers;
    const offers = [];
    for (const offer of Object.getOwnPropertyNames(pointOffers)) {
      offers.push({offer: pointOffers[offer]});
    }

    return offers;
  }

  _adaptOffersToClient(offers) {
    const result = {};
    for (const offer of offers) {
      result[offer.title] = offer.price;
    }

    return result;
  }

  _getImages(pictures) {
    const images = [];

    for (const picture of pictures) {
      images.push([picture.src, picture.description]);
    }

    return images;
  }
}
