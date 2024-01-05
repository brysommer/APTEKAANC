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