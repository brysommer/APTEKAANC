import XLSX from 'xlsx';
import { sequelize } from './models/sequelize.js';
import { findALLDrugs } from './models/drugs.js';
import { runANC } from './ancData.js';
import { findALLZnaharPrices } from './models/priceZnahar.js';
import { runZnahar } from './znaharData.js';
import { logger } from './logger/index.js';
import { promises as fs } from 'fs';

const sharedFolderPath = '../price/SynologyDrive/';
let oldANC;
let oldZnah;

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

const writeArrayToXLSX = (arrayData, xlsxFilePath) => {

  const worksheet = XLSX.utils.aoa_to_sheet(arrayData);
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  XLSX.writeFile(workbook, xlsxFilePath);

  logger.info(`Записано ${arrayData.length} элементів в файл`);
  
  console.log("Масив записано в XLSX");
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
    let dataArray = await findALLDrugs();
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

    if(oldANC) {
      try {
        await fs.unlink(sharedFolderPath + oldANC);
        console.log('Файл успішно видалено');
      } catch (err) {
        console.error('Помилка при видаленні файлу:', err);
      }  
    }
  

    const date = new Date();
    const filename = date.toISOString().replace(/T/g, "_").replace(/:/g, "-");
    writeArrayToXLSX(csvData, sharedFolderPath + `priceANC${filename}.xlsx`);

    oldANC = `priceANC${filename}.xlsx`;

    await new Promise(resolve => setTimeout(resolve, 30000));
    dataArray = []
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
    if(oldZnah) {
      try {
        await fs.unlink(sharedFolderPath + oldZnah);
        console.log('Файл успішно видалено');
      } catch (err) {
        console.error('Помилка при видаленні файлу:', err);
      }
    };
    const date = new Date();
    const filename = date.toISOString().replace(/T/g, "_").replace(/:/g, "-");
    console.log(`Довжина знахар:${csvDataZnahar.length}`);
    writeArrayToXLSX(csvDataZnahar, sharedFolderPath + `priceZnahar${filename}.xlsx`);

    oldZnah = `priceZnahar${filename}.xlsx`;

    //await new Promise(resolve => setTimeout(resolve, 300000));
    csvDataZnahar = [];
  } catch (error) {
    console.error('Помилка Znahar: ', error);
  }
  run();
};

run();