import { Model, DataTypes } from "sequelize";
import { sequelize } from './sequelize.js';


class Drugs extends Model {}
Drugs.init({
    drug_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    drug_inits: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    }
    

}, {
    freezeTableName: false,
    timestamps: true,
    modelName: 'drugs',
    sequelize
});

const createNewDrug = async (drugData) => {
    let res;
    try {
        res = await Drugs.create({ ...drugData });
        res = res.dataValues;
    } catch (err) {
        console.error(`Impossible to create drug: ${err}`);
    }
    return res;
};

/*
const updateDrugByChatId = async (chat_id, updateParams) => {
    const res = await User.update({ ...updateParams } , { where: { chat_id } });
    if (res[0]) {
        const data = await findUserByChatId(chat_id);
        if (data) {
            logger.info(`User ${data.chat_id} updated`);
            return data;
        }
        logger.info(`User ${chat_id} updated, but can't read result data`);
    } 
    return undefined;
};
*/




const findDrugByName = async (id) => {
    const res = await User.findAll({ where: { id: id } });
    if (res.length > 0) return res.map(el => el.dataValues);
    return;
};

const findALLDrugs = async () => {
    const res = await Drugs.findAll({ where: {  } });
    if (res.length > 0) return res.map(el => el.dataValues);
    return;
};

export {
    Drugs,
    createNewDrug,
    findDrugByName,
    findALLDrugs,
};   