import { Model, DataTypes } from "sequelize";
import { sequelize } from './sequelize.js';


class ZnaharNames extends Model {}
ZnaharNames.init({
    drug_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

}, {
    freezeTableName: false,
    timestamps: true,
    modelName: 'znaharnames',
    sequelize
});

const createNewZnahar = async (drugData) => {
    let res;
    try {
        res = await ZnaharNames.create({ ...drugData });
        res = res.dataValues;
        console.log(res);
    } catch (err) {
        //console.error(`Impossible to create Znahar: ${err}`);
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

const findALLZnaharNames = async () => {
    const res = await ZnaharNames.findAll({ where: {  } });
    if (res.length > 0) return res.map(el => el.dataValues);
    return;
};

export {
    ZnaharNames,
    createNewZnahar,
 //   findDrugByName,
    findALLZnaharNames,
};   