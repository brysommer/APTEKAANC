import XLSX from 'xlsx';
import { sequelize } from './models/sequelize.js';
import { findALLDrugs } from './models/drugs.js';
import { runANC } from './ancData.js';
import { findALLZnaharPrices } from './models/priceZnahar.js';
import { runZnahar } from './znaharData.js';
import { logger } from './logger/index.js';

const sharedFolderPath = '../price/SynologyDrive/';

const main = async () => {
  const models = {
      list:  [
          'drugs'
      ]
  };
  // DB
  const configTables = models.list;
  const dbInterface = sequelize.getQueryInterface();
  try {
    const checks = await Promise.all(configTables.map(configTable => {
        return dbInterface.tableExists(configTable);
    }));
    const result = checks.every(el => el === true);
    if (!result) {
        // eslint-disable-next-line no-console
        console.error(`🚩 Failed to check DB tables`);
        throw (`Some DB tables are missing`);
    }
  } catch (error) {
    console.error(`🚩 egfrsgs ${error}` );

  }
  

}; 

main();




const writeArrayToXLS = (arrayData, xlsFilePath) => {
  try {
    const maxRowsPerSheet = 50000;
    const sheets = [];
    let count = 1;
    
    for(let i = 0; i < arrayData.length; i += maxRowsPerSheet) {
      const chunk = arrayData.slice(i, i + maxRowsPerSheet);
      const sheetName = `PART_${count++}`; 
      
      const worksheet = XLSX.utils.aoa_to_sheet(chunk);
      sheets.push({name: sheetName, worksheet});
    }
    
    const workbook = XLSX.utils.book_new();
    
    sheets.forEach(sheet => {
      XLSX.utils.book_append_sheet(workbook, sheet.worksheet, sheet.name); 
    });
    
    XLSX.writeFile(workbook, sharedFolderPath + xlsFilePath);
    console.log(sheets.length, arrayData.length, xlsFilePath)
    
    logger.info(`Записано ${sheets.length} частин, ${arrayData.length} элементів в ${xlsFilePath.slice(0, 9)}`);
    console.log('Масив успішно записано в XLS.');
  } catch (error) {
    logger.warn(`Масив: ${arrayData.length} Шлях: ${xlsFilePath} Помилка під час запису масиву в XLS:`, error)
    console.error('Помилка під час запису масиву в XLS:', error);
  }
}

async function run() {
  
  try {
    await runANC();
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
      'updated_at',
    ]];    
    const dataArray = await findALLDrugs();
    for (const el of dataArray) {
      csvData.push([
        el.id,
        el.drug_id,
        el.drug_name,
        el.drug_producer,
        'ID',
        el.pharmacy_name,
        el.pharmacy_region,
        'addres',
        el.price,
        el.availability_status,
        el.updatedAt
      ])
    }
    const date = new Date();
    const filename = date.toISOString().replace(/T/g, "_").replace(/:/g, "-");
    writeArrayToXLS(csvData, `priceANC${filename}.xls`);
  } catch (error) {
    console.error('Помилка ANC: ', error);
  }


  try {
    await runZnahar();
    let csvDataZnahar = [[
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
      'znahar_id',
      'updated_at',
    ]];    
    const dataArrayZnahar = await findALLZnaharPrices();
    for (const el of dataArrayZnahar) {
      csvDataZnahar.push([
        el.id,
        el.drug_id,
        el.drug_name,
        el.drug_producer,
        el.pharmacy_id,
        el.pharmacy_name,
        el.pharmacy_region,
        el.pharmacy_address,
        el.price,
        el.availability_status,
        el.drug_name,
        el.updatedAt
      ])
    }
    const date = new Date();
    const filename = date.toISOString().replace(/T/g, "_").replace(/:/g, "-");
    console.log(`Довжина знахар:${csvDataZnahar.length}`);
    writeArrayToXLS(csvDataZnahar, `priceZnahar${filename}.xls`);
  } catch (error) {
    console.error('Помилка Znahar: ', error);
  }
  run();
};

run();



/*
const generateNumbers = async () => {
  const ancNames = await findAllAncNames();
  for (const city of ancDB) {
    let numbers = [];
    //for (const name of ancNames) {
    for (let i = 6; i <= 30; i++) {  //52000
      numbers.push(i);
      if (numbers.length >= 11) {

        console.log(numbers.join(","));
        
        const xml = await getXMLPrice(city.id, numbers.join(","));

        xml.forEach((item) => {
          if (item.price == 0) return;
          createNewDrug({
            drug_id: item.id,
            drug_name: item.name,
            drug_producer: item.producer.name,
            pharmacy_name: 'ANC',
            pharmacy_region: city.city,
            price: item.price,
            availability_status: 'Забронювати',   
          })
        });
        numbers = [];
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }


  }
  
  
}

generateNumbers();
*/

