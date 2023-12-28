const axios = require('axios');
const fs = require('fs');
const XLSX = require('xlsx');

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
]];



const znaharDB = [
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


function findCategoryById(categories, id) {
  for (const category of categories) {
    if (category.$ && category.$.id === id) {
      return category._;
    }
  }
  return null;
}

const getXMLPrice = async(city, products) => {
  try {
    const response = await axios.get(`https://anc.ua/productbrowser/v2/ua/products?city=${city}&products=${products}`);
    return response.data;
  } catch (error) {
    console.error('Помилка при отриманні XML: ', error);
    throw error;
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

async function run() {
  try {
    const xmlData = await getXMLPrice();
    const dataArray = await convertXMLToCSV(xmlData)
    writeArrayToXLS(dataArray, 'price.xls');
  } catch (error) {
    console.error('Помилка: ', error);
  }
}

const generateNumbers = async () => {
  try {
    let numbers = [];
    for (let i = 70000; i <= 75000; i++) {  //52000
      numbers.push(i);
      if (numbers.length >= 11) {
        console.log(numbers.join(","));
        const xml = await getXMLPrice(28, numbers.join(","));

        xml.forEach((item) => {
            csvData.push([
              '0',
              item.id,
              item.name,
              item.producer.name,
              'pharmacy_id',
              'ANC',
              'Львів',
              'pharmacy_address',
              item.price,
              item.canBeOrdered,
              new Date(),
            ]);
        });

        numbers = [];
      }
    }
    writeArrayToXLS(csvData, 'ANC.xls');
  
  } catch (error) {
    console.error('Помилка: ', error);
  }
}

generateNumbers();


