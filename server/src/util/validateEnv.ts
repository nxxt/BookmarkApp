import { cleanEnv, str, port } from "envalid";

export function validateEnv() {
  cleanEnv(process.env, {
    DBURL: str(),
    DBNAME: str(),
    PORT: port(),
    HOST: str(),
  });
}
