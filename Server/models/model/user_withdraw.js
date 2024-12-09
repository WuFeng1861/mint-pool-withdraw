export default function(sequelize, DataTypes) {
  return sequelize.define('user_withdraw', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "主键id"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "用户id"
    },
    amount: {
      type: DataTypes.DECIMAL(20,8),
      allowNull: true,
      comment: "提币数量"
    },
    fee_type: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "0 余额 1充值"
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "用户地址"
    }
  }, {
    sequelize,
    tableName: 'user_withdraw',
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
