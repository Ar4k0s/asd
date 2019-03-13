
const express = require("express")
const mysql = require("mysql")
const app = express()

const table="vchody"

var con = mysql.createConnection({
    host: "localhost",
    user: "jakub",
    password: "jakub",
    database: "gov",
    multipleStatements: true
  });
  con.connect(function(err) {})




app.use('/',(req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Content-Type","application/json")
    next()

})
app.get("/",function(req,res){
    
    const query = req.query
   

    const sqlInfo={

        draw : query.draw,

        len : query.length,

        start: query.start,

        search: query.search.value,

        columnsToSelect:"",

        columnsArr:[],

        //first parameter number of columns second : asc/desc
        orderBy: {column: query.order[0].column, direction: query.order[0].dir},

        setColumnsToSelect: function(b){
            let a=[]
            b.forEach(x => a.push(x.data))
            this.columnsArr=a
            this.columnsToSelect=a.join()
        }
    }

    sqlInfo.setColumnsToSelect(query.columns)

    sql1=`SELECT ${sqlInfo.columnsToSelect} FROM ${table} WHERE _id LIKE '${sqlInfo.search}%' AND _id > ${sqlInfo.start} ORDER BY ${sqlInfo.columnsArr[sqlInfo.orderBy.column]} ${sqlInfo.orderBy.direction} LIMIT ${sqlInfo.len} ;`    
    //sql1=`SELECT ${sqlInfo.columnsToSelect} FROM ${table} WHERE _id LIKE '${sqlInfo.search}%' ORDER BY ${sqlInfo.columnsArr[sqlInfo.orderBy.column]} ${sqlInfo.orderBy.direction} LIMIT ${sqlInfo.len} OFFSET ${sqlInfo.start};`    
    sql2=`SELECT MAX(_id) as countAll FROM ${table};`
    sql3=`SELECT COUNT(*) as countFiltered   FROM ${table} WHERE _id LIKE '${sqlInfo.search}%';`    
    
    

    sql = sql1+sql2+sql3

   
    
    con.query(sql, function (err, result) {
        console.log(result[0])
        console.log('_____________________________')
        if(err) console.log(err); 
        else{               
            
            res.json({"draw":sqlInfo.draw,
            "recordsTotal": result[1][0].countAll,
            "recordsFiltered": result[2][0].countFiltered ,"data":result[0]})               
          
        }

      })
    })

   

app.get("/txt", function(req,res){
        
        res.setHeader("Content-Type", "application/xls")
        res.sendFile('/home/jakubbeno/Desktop/Pagination/api_key.xls')
    })
    


app.listen(8000,function(){
    console.log("Server is running...")
})