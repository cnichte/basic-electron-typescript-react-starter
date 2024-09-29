import { DocBook } from "../common/types/DocBook";
import { DocUser } from "../common/types/DocUser";
import { DocumentCreator } from "./DocumentCreator";

export function db_initialize() {
  DocumentCreator.loadTo<DocUser>(this, "./docs-json/users.json", DocUser);
  DocumentCreator.loadTo<DocBook>(this, "./docs-json/books.json", DocBook);
}
