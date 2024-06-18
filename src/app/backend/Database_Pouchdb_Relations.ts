// relational pouch support.
export const pouchdb_relations: Array<any> = [
  {
    singular: "user",
    plural: "users",
    relations: {
      users: { hasMany: "book" },
    },
  },
  {
    singular: "book",
    plural: "books",
    relations: {
      users: { hasMany: "user" },
    },
  },
];
