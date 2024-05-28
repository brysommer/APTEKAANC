import axios from 'axios';
import { findAllAncNames, updatelinkByDrug_id } from './models/ancNomenclatura.js';

const getXMLPrice = async (products) => {
  try {
    const response = await axios.get(`https://anc.ua/productbrowser/v2/ua/products?city=28&products=${products}`);
    return response.data;
  } catch (error) {
    console.error('Помилка при отриманні XML: ', error);
    throw error;
  }
}

const updateLinks = async () => {
    const ancNames = await findAllAncNames();
    const nameNeedLink = ancNames.filter(name => name.link == null);
    console.log(nameNeedLink.length)
    for (const link of nameNeedLink) {
        const xmlPrice = await getXMLPrice(link.drug_id)
        console.log(xmlPrice[0].link);
        if(xmlPrice[0].link) await updatelinkByDrug_id(link.drug_id, xmlPrice[0].link);
    }
    console.log('Лінки оновлено')     
}

updateLinks();