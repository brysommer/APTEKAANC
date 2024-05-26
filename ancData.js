import axios from 'axios';
import {  createNewDrug, updateDrugById,
  findAncPriceByDrugPharmacy } from './models/drugs.js';
import { findAllAncNames, updatelinkByDrug_id } from './models/ancNomenclatura.js';
import { logger } from './logger/index.js';

const ancDB = [
  
  {
    id: 28,
    city: 'Львів'
  },
  /*
  {
    id: 114,
    city: 'Івано-Франківськ'
  },
  {
    id: 11602,
    city: 'Трускавець'
  },
  {
    id: 27249,
    city: 'Моршин'
  },
  {
    id: 10359,
    city: 'Стебник'
  },
  {
    id: 116,
    city: 'Дрогобич'
  },
  {
    id: 108,
    city: 'Коломия'
  },
  {
    id: 27077,
    city: 'Долина'
  },
  {
    id: 26953,
    city: 'Болехів'
  },
  {
    id: 24042,
    city: 'Брошнів'
  },
  {
    id: 27028,
    city: 'Галич'
  },
  {
    id: 99,
    city: 'Ужгород'
  },
  */
]



const getXMLPrice = async(city, products) => {
  try {
    const response = await axios.get(`https://anc.ua/productbrowser/v2/ua/products?city=${city}&products=${products}`);
    return response.data;
  } catch (error) {
    console.error('Помилка при отриманні XML: ', error);
    throw error;
  }
}

const getPriceStock = async(link) => {
  try {
    const response = await axios.get(`https://anc.ua/productbrowser/v2/ua/products/${link}/pharmacies?city=28&district`);
    return response.data;
  } catch (error) {
    console.error('Помилка при отриманні XML: ', error);
    throw error;
  }
}

export const runANC = async () => {
  const ancNames = await findAllAncNames();


    for (let i = 0; i < ancNames.length; i++) {

      const ancName = ancNames[i];  
      if (i % 1000 === 0) {
        logger.info(`ANC обробляє елемент ${i}`); 
      }

        try {
          
          const drugData = await getPriceStock(ancName.link);



          const stock = drugData.count == 0 ? 'outOfStock' : drugData.count;
          console.log(ancName.drug_id, drugData.price, stock)

      const update = await updateDrugById(drugData.id, drugData.price, stock);
      console.log(update)
              //await updatelinkByDrug_id(item.id, item?.link);
              //написати утиліту
  
        } catch (error) {
          logger.error(`ANC parder error: ${error}`)
        }
        await new Promise(resolve => setTimeout(resolve, 500));
    }
  
}



