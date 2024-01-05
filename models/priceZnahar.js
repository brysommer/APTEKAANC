import { Model, DataTypes } from "sequelize";
import { sequelize } from './sequelize.js';


class ZnaharPrices extends Model {}
ZnaharPrices.init({
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
    pharmacy_id: {
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
    pharmacy_address: {
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
    znaharId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    }
}, {
    freezeTableName: false,
    timestamps: true,
    modelName: 'ZnaharPrices',
    sequelize
});

const createNewZnaharPrice = async (drugData) => {
    let res;
    try {
        res = await ZnaharPrices.create({ ...drugData });
        res = res.dataValues;
    } catch (err) {
        console.error(`Impossible to create drug: ${err}`);
    }
    return res;
};


const updateZnaharPrice = async (id, price) => {
    const res = await ZnaharPrices.update({ price } , { where: { id } });
    if (res[0]) {
            return res[0];
    } 
    return undefined;
};

const findZnaharPriceByDrugPharmacy = async (drug_id, pharmacy_id) => {
    const res = await ZnaharPrices.findOne({ where: { drug_id, pharmacy_id }});
    if (res) return res.dataValues;
    return;
}

const findALLZnaharPrices = async () => {
    const res = await ZnaharPrices.findAll({ where: {  } });
    if (res.length > 0) return res.map(el => el.dataValues);
    return;
};

export {
    ZnaharPrices,
    createNewZnaharPrice,
    updateZnaharPrice,
    findALLZnaharPrices,
    findZnaharPriceByDrugPharmacy,
};   