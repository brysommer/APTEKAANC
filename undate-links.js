import axios from 'axios';
import { findAllAncNames, updatelinkByDrug_id } from './models/ancNomenclatura.js';



const updateLinks = async () => {
    const ancNames = await findAllAncNames();
    console.log(ancNames[0].link)
    const nameNeedLink = ancNames.filter(name => name.link === undefined);
    console.log(nameNeedLink.lenght)
    for (link of nameNeedLink) {
        const getXMLPrice = async(products) => {
            try {
              const response = await axios.get(`https://anc.ua/productbrowser/v2/ua/products?city=28&products=${products}`);
              return response.data;
            } catch (error) {
              console.error('Помилка при отриманні XML: ', error);
              throw error;
            }
        }
        console.log(getXMLPrice.link);
    }      
}

updateLinks();