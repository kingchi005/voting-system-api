import jwt from 'jsonwebtoken'
import multer from 'multer'
// save avatar
let avatar_name_;
/*const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, '/uploads')
    cb(null, 'C:/Users/king/Desktop/voting-system/uploads')
  }
  , filename: function (req, file, cb) {
    let temp_file_arr = file.originalname.split('.')
    let temp_file_name = temp_file_arr[0]
    let temp_file_extension = temp_file_arr[1]
    const accepted_file = ["jpeg", "png", "jpg"]
      cb(null, avatar_name_)
    if (accepted_file.includes(temp_file_extension)) {
      avatar_name_ = `${temp_file_name}_${Date.now()}_${Math.round(Math.random() * 1E9)}.${temp_file_extension}`
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      req.locals = { avatar_name_ }
    } else {}
  }
})*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

// export const upload = multer({storage}).single('avatar')
export const upload = multer({ storage: storage }).single('avatar')
// upload(req, res, function (err) {
//   console.log(err)
//   res.locals.avatar_name = avatar_name
//   if (err) return res.status(505)
//     .json({ ok: false, msg: 'Error Uploading image' })
// })
export const handleUploadErr = (err,req,res,next)=>{
  if (err instanceof multer.MulterError) {
    res.status(400).json({ok:false,msg:err.message})
  }
}
export const requireVoterAuth = (req, res, next) => {

  let token = req.cookies._x_ray_mo_;
  if (token) {
    jwt.verify(token, process.env.secreTokenKey, (err, dt) => {
      if (err) {
        // res.redirect('/login-voter')
        res.status(401).json({ ok: false, msg: "Unauthorized request >_<" })
      } else {
        // console.log(dt)
        // res.locals.fm = fm;
        // res.locals.formatDistanceToNow = formatDistanceToNow;
        next();
      }
    })
  } else {
    res.status(401).json({ ok: false, msg: "Unauthorized request >_<" })
    // res.redirect('/login');
  }
  // next()
}
export const requireAdminAuth = (req, res, next) => {

  let token = req.cookies._x__r_a_y__m_u_m_m_y_;
  if (token) {
    jwt.verify(token, process.env.secreTokenKeyForAdmin, (err, dt) => {
      if (err) {
        // res.redirect('/login-voter')
        res.status(401).json({ ok: false, msg: "Unauthorized request >_<" })
      } else {
        // console.log(dt)
        // res.locals.fm = fm;
        // res.locals.formatDistanceToNow = formatDistanceToNow;
        next();
      }
    })
  } else {
    res.status(401).json({ ok: false, msg: "Unauthorized request >_<" })
    // res.redirect('/login');
  }
  // next()
}