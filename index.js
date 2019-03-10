const express = require("express")
const mysql = require("mysql")
const app = express()



var con = mysql.createConnection({
    host: "localhost",
    user: "jakub",
    password: "jakub",
    database: "test",
    multipleStatements: true
  });
  con.connect(function(err) {})


app.use((req,res,next)=>{
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
            a=a.toString()
            this.columnsToSelect=a
        }
    }

    sqlInfo.setColumnsToSelect(query.columns)

    sql1=`SELECT ${sqlInfo.columnsToSelect} FROM gov WHERE districtname LIKE '${sqlInfo.search}%'  ORDER BY ${sqlInfo.columnsArr[sqlInfo.orderBy.column]} ${sqlInfo.orderBy.direction} LIMIT ${sqlInfo.len} OFFSET ${sqlInfo.start};`    
    sql3 = "SELECT COUNT(*) as countAll FROM gov;"
    sql2=`SELECT COUNT(*) as countFiltered FROM gov WHERE districtname LIKE '${sqlInfo.search}%';`    
    

    sql = sql1+sql2+sql3

    con.query(sql, function (err, result) {
        
        if(err) console.log(err); 
        else{               
            console.log(result)
            res.json({"draw":sqlInfo.draw,
            "recordsTotal": result[2][0].countAll,
            "recordsFiltered": result[1][0].countFiltered ,"data":result[0]})               
          
        }

      })
    })

   



app.listen(8000,function(){
    console.log("Server is running...")
})