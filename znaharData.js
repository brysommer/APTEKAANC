import axios from 'axios';
import XLSX from 'xlsx';
import { findALLZnaharNames } from './models/ZnaharNames.js';
import { createNewZnaharPrice, findZnaharPriceByDrugPharmacy, updateZnaharPrice } from './models/priceZnahar.js';
import { logger } from './logger/index.js';

const znaharDB = [
    {
      id: 1,
      name: 'Вул. Хмельницького, 1',
      city: 'Львів'
    },
    {
      id: 2,
      name: 'Вул. Городоцька, 82',
      city: 'Львів'
    },
    {
      id: 3,
      name: 'Вул. Виговського, 29а',
      city: 'Львів'
    },
    {
      id: 4,
      name: 'Вул. Мазепи, 11',
      city: 'Львів'
    },
    {
      id: 5,
      name: 'Вул. Симоненка, 3',
      city: 'Львів'
    },
    {
      id: 6,
      name: 'Пр. Ч. Калини, 64',
      city: 'Львів'
    },
    {
      id: 7,
      name: 'Вул. Дорошенка, 6',
      city: 'Львів'
    },
    {
      id: 8,
      name: 'Вул. Хімічна, 22',
      city: 'Львів'
    },
    {
      id: 9,
      name: 'Вул. Личаківська, 54',
      city: 'Львів'
    },
    {
      id: 10,
      name: 'Вул. Сихівська, 22',
      city: 'Львів'
    },
    {
      id: 11,
      name: 'Вул. Шевченка, 366в',
      city: 'Львів'
    },
    {
      id: 12,
      name: 'Вул. Пасічна, 70',
      city: 'Львів'
    },
    {
      id: 14,
      name: 'Вул. В. Великого, 59а',
      city: 'Львів'
    },
    {
      id: 15,
      name: 'Вул. Шевченка, 60 (ТОЦ \"Семицвіт\")',
      city: 'Львів'
    },
    {
      id: 16,
      name: 'Вул. Галицька, 17',
      city: 'Винники'
    },
    {
      id: 17,
      name: 'Пр. Ч. Калини, 102',
      city: 'Львів'
    },
    {
      id: 18,
      name: 'Вул. Б. Хмельницького, 223 (АС - 2)',
      city: 'Львів'
    },
    {
      id: 19,
      name: 'Вул. Федьковича, 21',
      city: 'Львів'
    },
    {
      id: 20,
      name: 'Вул. Миколайчука, 9',
      city: 'Львів'
    },
    {
      id: 21,
      name: 'Пр. Шевченка, 26',
      city: 'Львів'
    },
    {
      id: 22,
      name: 'Пр. Ч. Калини, 36',
      city: 'Львів'
    },
    {
      id: 23,
      name: 'вул. Шевченка, 65',
      city: 'Стрий'
    },
  ]


const getApiData = async(search) => {
  try {
    const response = await axios.get(`https://www.apteka-znahar.com.ua/znahar/products/?${search}`);
    return response.data.data;
  } catch (error) {
    console.error('Помилка при отриманні XML: ', error);
    throw error;
  }
}

function findElementByWarehouseId(array, warehouseId) {
  const element = array.find(element => element.id === warehouseId);
  if (element) {
    return element;
  } else {
    return '-';
  }
}





function writeArrayToXLS(arrayData, xlsFilePath) {
  try {
    const workbook = XLSX.utils.book_new();
    const sheetName = 'Sheet1';
    const worksheet = XLSX.utils.aoa_to_sheet(arrayData);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, xlsFilePath);
    console.log('Масив успішно записано в XLS.');
  } catch (error) {
    console.error('Помилка під час запису масиву в XLS:', error);
  }
}

export async function runZnahar() {
  try {
    const apiData = await findALLZnaharNames();

    for (let i = 0; i < apiData.length; i++) {
        if (i % 1000 === 0) {
          logger.info(`Знахар обробляє елемент #${i}`)
        }

        const el = apiData[i];
        try {
            const results = await getApiData(
              `offset=0&limit=50&filter_name=${el.drug_name}&warehouses[]=1&warehouses[]=2&warehouses[]=3&warehouses[]=4&warehouses[]=5&warehouses[]=6&warehouses[]=7&warehouses[]=8&warehouses[]=9&warehouses[]=10&warehouses[]=11&warehouses[]=12&warehouses[]=13&warehouses[]=14&warehouses[]=15`
            );
            results.map(async (item) => {
              item.id = el.id;
              return item;
            });
            for (const el of results) {
              const element = await findZnaharPriceByDrugPharmacy(el.id, el.warehouse_id);
              if (element) {
                await updateZnaharPrice(element.id, el.price);
              } else {
                await createNewZnaharPrice({
                  drug_id: el.id,
                  drug_name: el.name,
                  drug_producer: el.producer,
                  pharmacy_id: el.warehouse_id,
                  pharmacy_name: 'Аптека Знахар',
                  pharmacy_region: findElementByWarehouseId(znaharDB, el.warehouse_id).city,
                  pharmacy_address: findElementByWarehouseId(znaharDB, el.warehouse_id).name,
                  price: el.price,
                  availability_status: 'Забронювати',
                  znaharId: el.name
                })  
              }
            }

          } catch (error) {
            logger.warn('Помилка Знахара при обробці елемента', i, error)
            console.error('Помилка при обробці елемента', i, error);
          }
        await new Promise(resolve => setTimeout(resolve, 500));
      }

  } catch (error) {
    console.error('Помилка: ', error);
  }
}

//run();
