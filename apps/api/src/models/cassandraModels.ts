export interface ContactPointRequest {
  dc: string;
  hosts: string[];
}

export interface RequestKeyspaceEntity {
  contactPoints: string[];
  dataCenter: string;
}

export interface ExecuteQueryRequest {
  contactPoints: string[];
  dataCenter: string;
  keyspace: string;
  query: string;
}

  