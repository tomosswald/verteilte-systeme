function mapUpdateBodyToSQL(body){
    var sql = 'SET ';

    for (const [key, value] of Object.entries(body)) {
        if(key !== "done"){
            sql+=`${key}="${value}", `
        } else {
            sql+=`${key}=${value ? "1" : "0"}, `
        }

        
    }


   return sql.trim().slice(0, -1);
}

module.exports = {
    mapUpdateBodyToSQL,
}