export default class Offers {
  constructor() {
    this._offers = {};
  }

  setOffers(offers) {
    this._offers = this._adaptToClient(offers);
  }

  getOffers(type) {
    return this._offers[type];
  }

  _adaptToClient(offers) {
    const result = {};
    for (const offer of offers) {
      const availableOffers = [];
      for (const option of offer.offers) {
        const title = option.title;
        const price = parseInt(option.price);
        availableOffers.push({
          title: price,
        });
      }
      result[offer.type] = availableOffers;
    }

    return result;
  }
}
