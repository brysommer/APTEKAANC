import axios from 'axios';
import {  createNewDrug, updateDrugById,
  findAncPriceByDrugPharmacy } from './models/drugs.js';
import { findAllAncNames } from './models/ancNomenclatura.js';
import { logger } from './logger/index.js';

const ancDB = [
  {
    id: 28,
    city: 'Львів'
  },
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

export const runANC = async () => {
  const ancNames = await findAllAncNames();

  for (const city of ancDB) {
    logger.info(`Parser started to work on ${city.city}`)
    let numbers = [];

    for (let i = 0; i < ancNames.length; i++) {
      const ancName = ancNames[i];  
      if (i % 1000 === 0) {
        logger.info(`ANC обробляє елемент ${i}`); 
      }
      numbers.push(ancName.drug_id);
      if (numbers.length >= 11) {

        //console.log(`City: ${city.id} Nambers: ${numbers.join(",")}`);
        try {
          const xml = await getXMLPrice(city.id, numbers.join(","));

          xml.forEach(async (item) => {
            if (item.price == 0) return;
            const ancDrug = await findAncPriceByDrugPharmacy(item.id, city.city);
            if (ancDrug) {
              await updateDrugById(ancDrug.id, item.price)
            } else {
              await createNewDrug({
                drug_id: item.id,
                drug_name: item.name,
                drug_producer: item.producer.name,
                pharmacy_name: 'ANC',
                pharmacy_region: city.city,
                price: item.price,
                availability_status: 'Забронювати',   
              })
            }
          });
  
        } catch (error) {
          logger.error(`ANC parder error: ${error}`)
        }
        numbers = [];
       // await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }
}



