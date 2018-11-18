import { Client } from 'pg'
import Connect from './connect'
import { Pool } from '../../utils/pool'
import { SQLCOnfig } from '../config'


export function createPool(config: SQLCOnfig) {
    let logger = config.log || console;
    var p = Pool.create({
        name: "postgresql",
        validate: function (client) {
            return true;
        },
        create: function (callback) {

            let url = `postgres://${config.user}:${config.password}@${config.host}:${config.port || 5432}/${config.database || 'postgres'}`
            let client = new Client(url);
            client.connect((err) => {
                if (err) {
                    console.error('postgresql 连接失败:', err)
                }
            })
            callback(new Connect(client))
        },
        destroy: function (client) {
            client.close();
        },
        maxPoolNum: config.maxPoolNum || 1,
        idleTimeoutMills: config.idleTimeoutMills || 3000,
        minPoolNum: config.minPoolNum || 1,
    });
    process.on("exit", function () {
        p.destroyAllNow();
    });
    return p;
}