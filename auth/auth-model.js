const db = require("../database/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  update,
  remove,
};

function find() {
  return db("users").select("id", "username");
}

function findBy(filter) {
  return db("users").select("id", "username", "password").where(filter);
}

function findById(id) {
  return db("users").select("id", "username").where({ id }).first();
}

async function add(user) {
  const [id] = await db("users").insert(user, "id");

  return findById(id);
}

function update(changes, id) {
  return db("users")
    .where("id", id)
    .update(changes)
    .then((count) => {
      count > 0 ? findById(id) : null;
    });
}

function remove(id) {
  return db("users").where("id", id).del();
}
