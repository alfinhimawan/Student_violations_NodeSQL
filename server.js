const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")                   

const app = express()  
app.use(cors())                                    
app.use(bodyParser.json())                          
app.use(bodyParser.urlencoded({extended: true}))

const siswa = require("./controllers/siswa_controllers")
app.use("/siswa", siswa)

const user = require("./controllers/user_controllers")
app.use("/user", user)

const pelanggaran = require("./controllers/pelanggaran_controllers") 
app.use("/pelanggaran", pelanggaran) 

const pelanggaran_siswa = require("./controllers/pelanggaran_siswa_controllers") 
app.use("/pelanggaran_siswa", pelanggaran_siswa) 

const guru = require("./controllers/guru_controllers")
app.use("/guru", guru)

/* membuat web server dengan port 8000 */
app.listen(8000, () => {
    console.log("server run on port 8000")
})
