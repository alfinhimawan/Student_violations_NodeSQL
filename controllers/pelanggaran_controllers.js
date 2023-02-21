const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config") 

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// end-point akses data user
app.get("/", (req, res) => {
    // create sql query
    let sql = "select * from pelanggaran"

    // run query
    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message 
            }            
        } else {
            response = {
                count: result.length,
                pelanggaran: result
            }            
        }
        res.json(response) 
    })
})

// end-point akses data user berdasarkan id_user tertentu
app.get("/:id", (req, res) => {
    let data = {
        id_pelanggaran: req.params.id
    }
    // create sql query
    let sql = "select * from pelanggaran where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message 
            }            
        } else {
            response = {
                count: result.length,
                pelanggaran: result
            }            
        }
        res.json(response) 
    })
})

// end-point menyimpan data pelanggaran
app.post("/", (req,res) => {

    // prepare data
    let data = {
        nama_pelanggaran: req.body.nama_pelanggaran,
        poin: req.body.poin
    }

    // create sql query insert
    let sql = "insert into pelanggaran set ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data inserted"
            }
        }
        res.json(response) 
    })
})

// end-point mengubah data pelanggaran
app.put("/:id_pelanggaran", (req,res) => {

    // prepare data
    let data = [
        {
            nama_pelanggaran: req.body.nama_pelanggaran,
            poin: req.body.poin
        },

        // parameter (primary key)
        {
            id_pelanggaran: req.params.id_pelanggaran
        }
    ]

    // create sql query update
    let sql = "update pelanggaran set ? where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response) 
    })
})

// end-point mengubah data pelanggaran
app.put("/", (req,res) => {

    // prepare data
    let data = [
        {
            nama_pelanggaran: req.body.nama_pelanggaran,
            poin: req.body.poin
        },

        // parameter (primary key)
        {
            id_pelanggaran: req.body.id_pelanggaran
        }
    ]

    // create sql query update
    let sql = "update pelanggaran set ? where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response) 
    })
})

// end-point menghapus data pelanggaran berdasarkan id_pelanggaran
app.delete("/:id_pelanggaran", (req,res) => {
    // prepare data
    let data = {
        id_pelanggaran: req.params.id_pelanggaran
    }

    // create query sql delete
    let sql = "delete from pelanggaran where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response) 
    })
})

module.exports = app
