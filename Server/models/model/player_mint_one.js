export default function(sequelize, DataTypes) {
  return sequelize.define('player_mint_one', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "主键id"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "用户id"
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "mint类型 1余额直接扣 2充值"
    },
    bnb_amount: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
      comment: "bnb数量"
    },
    merc_amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "merc数量"
    },
    chain_hash: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "链上交易hash"
    }
  }, {
    sequelize,
    tableName: 'player_mint_one',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
