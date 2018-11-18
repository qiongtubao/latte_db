import { createPool } from './pool'
import { Dao } from '../../utils/dao'
export default {
    create: function (config) {
        return new Dao(createPool, config);
    }
}