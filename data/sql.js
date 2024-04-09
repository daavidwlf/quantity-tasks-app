import * as SQLite from 'expo-sqlite';

sql = []

sql.db = SQLite.openDatabase('activitiesDB');

sql.createTable = () =>{
    return new Promise((resolve, reject) => {
        sql.db.transaction(
            function (tx) {
                tx.executeSql("CREATE TABLE IF NOT EXISTS activitiesTable (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, count INTEGER DEFAULT 0 )");
            },
            function (error) {
                reject(error.message);
            },
            function () {
                resolve(true);
                console.log('Created table succesfully');
            }
      );
    });
}

sql.getAllData = (callback) => {
    sql.db.transaction(
        tx => {
            tx.executeSql(
            `SELECT * FROM activitiesTable`,
            null,
            (textObj, result) => {callback(result.rows._array)},
            (textObj, err) => {console.log(err)}
            )
        }
    )
}

sql.getDataById = (id, callback) => {
    sql.db.transaction(
        tx => {
            tx.executeSql(
            `SELECT * FROM activitiesTable WHERE id = ${id}`,
            null,
            (textObj, result) => {callback(result.rows._array)},
            (textObj, err) => {console.log(err)}
            )
        }
    )
}

sql.setNewData = (title) =>{
    sql.db.transaction(
        tx => {
            tx.executeSql(
                `INSERT INTO activitiesTable (title) VALUES ('${title}')`,
                [title],
                (textObj, result) => {console.log(result.rows._array)},
                (textObj, err) => {console.log(err)}
            )
        }
    )
}

sql.delData = (id) =>{
    sql.db.transaction(
        tx => {
            tx.executeSql(
                `DELETE FROM activitiesTable WHERE id = '${id}'`,
                null,
                (textObj, result) => {console.log(`Deletet ${id} successfully`, result.rows._array)},
                (textObj, err) => {console.log(err)}
            )
        }
    )
}

sql.updateCount = (id, count) =>{
    sql.db.transaction(
        tx => {
            tx.executeSql(
                `UPDATE activitiesTable SET count = ${count} WHERE id = ${id}`,
                null,
                (textObj, result) => {console.log(`Updatet ${id} successfully`, result.rows._array)},
                (textObj, err) => {console.log(err)}
            )
        }
    )
}

sql.clearTable = () =>{
    sql.db.transaction(
        tx => {
            tx.executeSql(
                `DELETE FROM activitiesTable`,
                null,
                (textObj, result) => {console.log(`Table cleared successfully`)},
                (textObj, err) => {console.log(err)}
            )
        }
    )
}


export default sql;