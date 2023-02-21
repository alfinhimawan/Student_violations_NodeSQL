const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config") //import konfigurasi database
const multer = require("multer") // untuk upload file
const path = require("path") // untuk memanggil path direktori
const fs = require("fs") // untuk manajemen file
const { error } = require("console")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // set file storage
        cb(null, './image');
    },
    filename: (req, file, cb) => {
        // generate file name 
        cb(null, "image-"+ Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({storage: storage})

// endpoint untuk menambah data barang guru
app.post("/", upload.single("image"), (req, res) => {
    // prepare data
    let data = {
        nip : req.body.nip,
        nama_guru : req.body.nama_guru,
        tgl_lahir : req.body.tgl_lahir,
        alamat : req.body.alamat,
        image : req.file.filename
    }

    if (!req.file) {
        // jika tidak ada file yang diupload
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    } else {
        // create sql insert
        let sql = "insert into guru set ?"

        // run query
        db.query(sql, data, (error, result) => {
            if(error) throw error
            res.json({
                message: result.affectedRows + " data berhasil disimpan"
            })
        })
    }
})

// end-point akses data guru
app.get("/", (req, res) => {
    // create sql query
    let sql = "select * from guru"

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
                guru: result 
            }            
        }
        res.json(response) 
    })
})

app.get("/:id", (req,res) => {
    let data = {
        id_guru: req.params.id
    }

    let sql = "select * from guru where ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message : error.message
            }
        } else {
            response = {
                count : result.length,
                guru : result
            }
        }
        res.json(response)
    })
})

// end-point mengubah data guru
app.put("/:id", upload.single("image"), (req,res) => {
    let data = null, sql =  null
    // parameter perubahan data
    let param = {
        id_guru : req.params.id
    }

    if (!req.file) {
        // jika tidak ada file yang dikirim = update data saja
        data = {
            nip : req.body.nip,
            nama_guru : req.body.nama_guru,
            tgl_lahir : req.body.tgl_lahir,
            alamat : req.body.alamat
        }
    } else {
        // jika mengirim file = update data + reupload
        data = {
            nip : req.body.nip,
            nama_guru : req.body.nama_guru,
            tgl_lahir : req.body.tgl_lahir,
            alamat : req.body.alamat,
            image : req.file.filename
        }

        // get data yang akan diupdate untuk mendapatkan nama file yang lama

        sql = "select * from guru where ?"
        // run query
        db.query(sql, param, (error, result) => {
            if (error) throw error
            // tampung nama file yang lama
            let filename = result[0].image

            // hapus file yang lama
            let dir = path.join(__dirname,"image",filename)
            fs.unlink(dir, (error) => {})
        })
    }
    
    // create sql update
    sql = "update guru set ? where ?"

    // jalankan sql update
    db.query(sql, [data,param], (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil diubah"
            })
        }
    })

})

// endpoint untuk menghapus data guru
app.delete("/:id", (req,res) => {
    let param = {id_guru: req.params.id}

    // ambil data yang akan dihapus
    let sql = "select * from guru where ?"
    // jalankan query
    db.query(sql, param, (error, result) => {
        if (error) throw error
        
        // tampung nama file yang lama
        let fileName = result[0].image

        // hapus file yg lama
        let dir = path.join(__dirname,"image",fileName)
        fs.unlink(dir, (error) => {})
    })

    // create sql delete
    sql = "delete from guru where ?"

    // jalankan query
    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil dihapus"
            })
        }      
    })
})

module.exports = app