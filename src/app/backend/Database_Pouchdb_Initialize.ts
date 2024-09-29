import { DocBook } from "../common/types/DocBook";
import { DocUser } from "../common/types/DocUser";
import { DatabaseCRUD_Interface } from "./Database_Types";
import { DocumentCreator } from "./DocumentCreator";

export function db_initialize(db:DatabaseCRUD_Interface) {
  DocumentCreator.loadTo<DocUser>(db, "./docs-json/users.json", DocUser);
  DocumentCreator.loadTo<DocBook>(db, "./docs-json/books.json", DocBook);
}
