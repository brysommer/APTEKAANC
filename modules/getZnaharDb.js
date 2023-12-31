import { findALLDrugs } from '../models/drugs.js';
import { findALLZnaharNames, createNewZnahar } from '../models/ZnaharNames.js';
import fs from 'fs';


const drugsData = await findALLDrugs();

const getUniqueValues = (array) => {
    const uniqueValues = new Set();
    for (const value of array) {
      uniqueValues.add(value.drug_inits);
    }
    return Array.from(uniqueValues);
  }
  
const searchWords = getUniqueValues(drugsData);


const getApiData = async(search) => {
    try {
      const response = await axios.get(`https://www.apteka-znahar.com.ua/znahar/products/?${search}`);
      return response.data.data;
    } catch (error) {
      console.error('Помилка при отриманні XML: ', error);
      throw error;
    }
  }

async function run(searchWords) {
    try {
        searchWords.forEach(async el => {
            const apiData = await getApiData(`offset=0&limit=1000&filter_name=${el}&warehouses[]=1`);
            apiData.forEach(async el => await createNewZnahar({drug_name: el.name}))
        })
    /*
      const pricesDataPromises = apiData.map( el => {
        return getApiData( `offset=0&limit=50&filter_name=${el.name}&warehouses[]=1&warehouses[]=2&warehouses[]=3&warehouses[]=4&warehouses[]=5&warehouses[]=6&warehouses[]=7&warehouses[]=8&warehouses[]=9&warehouses[]=10&warehouses[]=11&warehouses[]=12&warehouses[]=13&warehouses[]=14&warehouses[]=15`);
      })
      const pricesData = await Promise.all(pricesDataPromises);
      const dataArray = convertArrayToSheet(pricesData);
      writeArrayToXLS(dataArray, 'Znahar.xls');
    */
    } catch (error) {
      console.error('Помилка: ', error);
    }
  }
  run(searchWords);

  fs.writeFileSync("searchwords.json", JSON.stringify(searchWords));

