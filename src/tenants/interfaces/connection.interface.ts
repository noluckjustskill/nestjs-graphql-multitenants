export interface IConnection {
  name: string;
  repositories: {
    [repo: string]: any[];
  }
};

export interface IDb {
  [name: string]: IConnection;
};
