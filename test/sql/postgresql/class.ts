/**
 * 理想化的demo
 */
class Table extends BaseTable {
    @TableName()
    tablename: string;
    @Type({

    })
    name: string;
}
let table = new Table();
console.log(table);
