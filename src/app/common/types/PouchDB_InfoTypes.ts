
// https://www.tutorialspoint.com/pouchdb/pouchdb_database_info.htm
export interface PouchDB_Info_Localstore {
    doc_count: number;
    update_seq: number
    backend_adapter: string,
    db_name: string,
    auto_compaction: boolean,
    adapter: string;
}

export interface PouchDB_Info_Remotestore {
    db_name: string;
    doc_count: number; 
    doc_del_count: number;
    update_seq: number;
    purge_seq: number;
    compact_running: boolean;
    disk_size: number; 
    data_size: number;
    instance_start_time: string;
    disk_format_version: number; 
    committed_update_seq: number;
    host: string; 
    auto_compaction: boolean;
    adapter: number;
}

