const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config")
const md5 = require("md5")         

// implementation
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// end-point akses data user
app.get("/", (req, res) => {
    // create sql query
    let sql = "select * from user"

    // run query
    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }            
        } else {
            response = {
                count: result.length, // jumlah data
                siswa: result // isi data
            }            
        }
        res.json(response) // send response
    })
})
// end-point akses data user berdasarkan id_user tertentu
app.get("/:id", (req, res) => {
    let data = {
        id_siswa: req.params.id
    }
    // create sql query
    let sql = "select * from user where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }            
        } else {
            response = {
                count: result.length, // jumlah data
                siswa: result // isi data
            }            
        }
        res.json(response) // send response
    })
})
// end-point menyimpan data user
app.post("/", (req,res) => {

    // prepare data
    let data = {
        nama_user: req.body.nama_user,
        username: req.body.username,
        password: md5(req.body.password)
    }

    // create sql query insert
    let sql = "insert into user set ?"

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
        res.json(response) // send response
    })
})

// end-point mengubah data user
app.put("/:id_user", (req,res) => {

    // prepare data
    let data = [
        // data
        {
            nama_user: req.body.nama_user,
            username: req.body.username,
            password: md5(req.body.password)
        },

        // parameter (primary key)
        {
            id_user: req.params.id_user
        }
    ]

    // create sql query update
    let sql = "update user set ? where ?"

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
        res.json(response) // send response
    })
})

// end-point mengubah data user
app.put("/", (req,res) => {

    // prepare data
    let data = [
        // data
        {
            nama_user: req.body.nama_user,
            username: req.body.username,
            password: md5(req.body.password)
        },

        // parameter (primary key)
        {
            id_user: req.body.id_user
        }
    ]

    // create sql query update
    let sql = "update user set ? where ?"

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
        res.json(response) // send response
    })
})

// end-point menghapus data user berdasarkan id_user
app.delete("/:id", (req,res) => {
    // prepare data
    let data = {
        id_user: req.params.id
    }

    // create query sql delete
    let sql = "delete from user where ?"

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
        res.json(response) // send response
    })
})

module.exports = app // Expotr supaya dapat diacc di server.js
