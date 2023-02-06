const conn = require('./connection');

const listAll = async () => {
  const [sales] = await conn.execute(
    'SELECT * FROM StoreManager.sales',
  );
  const [products] = await conn.execute(
    'SELECT * FROM StoreManager.sales_products',
  );
  return { sales, products };
};

const insertNew = async (data) => {
  const [{ insertId }] = await conn.execute(
    'INSERT INTO StoreManager.sales (date) VALUES (now())',
  );
  await Promise.all(data.map(async ({ productId, quantity }) => {
      await conn.execute(
        'INSERT INTO sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?)',
        [insertId, productId, quantity],
      );
    }));
  return insertId;
};

module.exports = {
  insertNew,
  listAll,
};