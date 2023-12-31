import axios from 'axios';
import XLSX from 'xlsx';
import { findALLZnaharNames } from './models/ZnaharNames.js';

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

let csvData = [[
    'id',
    'drug_id',
    'drug_name',
    'drug_producer',
    'pharmacy_id',
    'pharmacy_name',
    'pharmacy_region',
    'pharmacy_address',
    'price',
    'availability_status',
    'created_at',
    'znaharId',
]];


function convertArrayToSheet(APIdata) {


  APIdata.forEach((item) => {
      item.forEach((item) => {
        csvData.push([
          '0',
          'невідомо',
          item.name,
          item.producer,
          item.warehouse_id,
          'Аптека Знахар',
          findElementByWarehouseId(znaharDB, item.warehouse_id).city,
          findElementByWarehouseId(znaharDB, item.warehouse_id).name,
          item.price,
          'Забронювати',
          new Date(),
          item.name,
        ]
        );
      })
  });
  return csvData;
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

async function run() {
  try {
    const apiData = await findALLZnaharNames();

    const pricesData = [];

    


    for (let i = 6000; i < apiData.length; i++) {
        console.log(i)
        const el = apiData[i];
        try {
            const results = await getApiData(
              `offset=0&limit=50&filter_name=${el.drug_name}&warehouses[]=1&warehouses[]=2&warehouses[]=3&warehouses[]=4&warehouses[]=5&warehouses[]=6&warehouses[]=7&warehouses[]=8&warehouses[]=9&warehouses[]=10&warehouses[]=11&warehouses[]=12&warehouses[]=13&warehouses[]=14&warehouses[]=15`
            );
            results.map((item) => {
              item.id = el.id;
              return item;
            });
            pricesData.push(results);
          } catch (error) {
            console.error('Помилка при обробці елемента', i, error);
          }
        }
  
    //await new Promise(resolve => setTimeout(resolve, 10000));

    let iNumber = 60951;

    pricesData.forEach((item) => {
        item.forEach((item) => {
          csvData.push([
            iNumber,
            item.id,
            item.name,
            item.producer,
            item.warehouse_id,
            'Аптека Знахар',
            findElementByWarehouseId(znaharDB, item.warehouse_id).city,
            findElementByWarehouseId(znaharDB, item.warehouse_id).name,
            item.price,
            'Забронювати',
            new Date(),
            item.name,
          ]);
        iNumber++;
        })
    });

    await new Promise(resolve => setTimeout(resolve, 60000));

    writeArrayToXLS(csvData, 'Znahar.xls');
  } catch (error) {
    console.error('Помилка: ', error);
  }
}

run();
