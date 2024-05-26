import { Model, DataTypes } from "sequelize";
import { sequelize } from './sequelize.js';


class Drugs extends Model {}
Drugs.init({
    drug_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    drug_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    drug_producer: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    pharmacy_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    pharmacy_region: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    availability_status: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
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


const updateDrugById = async (drug_id, price, availability_status) => {
    const res = await Drugs.update({ price, availability_status } , { where: { drug_id } });
    if (res[0]) {
        return res[0];
    } 
    return undefined;
};

const findAncPriceByDrugPharmacy = async (drug_id, pharmacy_region) => {
    const res = await Drugs.findOne({ where: { drug_id, pharmacy_region }});
    if (res) return res.dataValues;
    return;
}


const findALLDrugs = async () => {
    const res = await Drugs.findAll({ where: { pharmacy_region: 'Львів' } });
    if (res.length > 0) return res.map(el => el.dataValues);
    return;
};

export {
    Drugs,
    createNewDrug,
    findALLDrugs,
    updateDrugById,
    findAncPriceByDrugPharmacy
};   