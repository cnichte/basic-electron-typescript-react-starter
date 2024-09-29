import { DocBook } from "../common/types/DocBook";
import { DocUser } from "../common/types/DocUser";
import { DocumentCreator } from "./DocumentCreator";

export function db_initialize(db:any) {
  DocumentCreator.loadTo<DocUser>(db, "./docs-json/users.json", DocUser);
  DocumentCreator.loadTo<DocBook>(db, "./docs-json/books.json", DocBook);
}
