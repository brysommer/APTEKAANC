import { Drugs, createNewDrug } from '../models/drugs.js';
import { ZnaharNames, createNewZnahar } from '../models/ZnaharNames.js';
import {createNewAncName, findAllAncNames, ANCnames} from '../models/ancNomenclatura.js';
import { ZnaharPrices } from '../models/priceZnahar.js';

const DEBUG = true;

const main = async () => {
    try {
        const syncState = await Promise.all([
            Drugs.sync(),
            ZnaharNames.sync(),
            ANCnames.sync(),
            ZnaharPrices.sync()
        ]);

        await sequelize.queryInterface.addColumn('ANCnames', 'link', {
            type: sequelize.Sequelize.STRING,
            allowNull: true,
        });
        
        
        if (DEBUG && syncState) {
            const drugData = {
                drug_name: 'лалалал',
            };

            createNewZnahar(drugData);
        }

    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
    }
};

main();
