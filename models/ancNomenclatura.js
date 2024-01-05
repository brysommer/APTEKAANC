import { Model, DataTypes } from "sequelize";
import { sequelize } from './sequelize.js';


class ANCnames extends Model {}
ANCnames.init({
    drug_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    drug_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    }
}, {
    freezeTableName: false,
    timestamps: true,
    modelName: 'ANCnames',
    sequelize
});

const createNewAncName = async (drugData) => {
    let res;
    try {
        res = await ANCnames.create({ ...drugData });
        res = res.dataValues;
    } catch (err) {
        console.error(`Impossible to create drug: ${err}`);
    }
    return res;
};

const findAllAncNames = async () => {
    const res = await ANCnames.findAll({ where: {  } });
    if (res.length > 0) return res.map(el => el.dataValues);
    return;
};

export {
    ANCnames,
    createNewAncName,
    findAllAncNames,
};   