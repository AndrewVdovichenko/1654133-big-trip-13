export default class Offers {
  constructor() {
    this._offers = {};
  }

  setOffers(offers) {
    this._offers = this._adaptToClient(offers);
  }

  getOffers() {
    return this._offers;
  }

  _adaptToClient(offers) {
    const result = {};

    for (const offer of offers) {
      result[offer.type] = [];
      for (const item of offer.offers) {
        
      }
    }

    return result;
  }
}