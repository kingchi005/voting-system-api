import jwt from 'jsonwebtoken'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { Admin } from '../models/model-config.js'



// cloudinary function -------------------------
cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name
  , api_key: process.env.cloudinary_api_key
  , api_secret: process.env.cloudinary_api_secret
})

export const uploadImage = async (image) => {
  const options = {
    use_filename: true
    , unique_filename: true
    , overwrite: true
    , resource_type: "auto"
    , invalidate: true

  }

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(image, options);
    // console.log(result);
    return result
  } catch (error) {
    // console.log(error)
    return error
  }
}

let returned_respinse = {
  asset_id: '8025bbebaf14bacd52a8e45eea306898'
  , public_id: 'Emmanuel_vlyzdc'
  , version: 1676295961
  , version_id: '34509c73dcab8b6a26b19ae2ee80c064'
  , signature: '3db52ee41c33758ff7b914bf07c9c0336abbfa91'
  , width: 150
  , height: 177
  , format: 'jpg'
  , resource_type: 'image'
  , created_at: '2023-02-13T13:46:01Z'
  , tags: []
  , bytes: 18951
  , type: 'upload'
  , etag: 'dc486fd948e75bfe96cc0e8c2084ef34'
  , placeholder: false
  , url: 'http://res.cloudinary.com/drzmvhomu/image/upload/v1676295961/Emmanuel_vlyzdc.jpg'
  , secure_url: 'https://res.cloudinary.com/drzmvhomu/image/upload/v1676295961/Emmanuel_vlyzdc.jpg'
  , folder: ''
  , original_filename: 'Emmanuel'
  , api_key: '861945827833516'
}
returned_respinse = {
  public_id: 'Emmanuel_vlyzdc'
  , url: 'http://res.cloudinary.com/drzmvhomu/image/upload/v1676295961/Emmanuel_vlyzdc.jpg'
}

export const requireVoterAuth = (req, res, next) => {

  let token = req.cookies._x_ray_mo_;
  if (token) {
    jwt.verify(token, process.env.secreTokenKey, (err, dt) => {
      if (err) {
        console.log('Unauthorized ---- '+req.method + ':  ' + process.env.BASE_URL + req.baseUrl)
        res.redirect('/login-voter')
        // res.status(401).json({ ok: false, msg: "Unauthorized request >_<" })
      } else {
        // console.log(dt)
        // res.locals.fm = fm;
        // res.locals.formatDistanceToNow = formatDistanceToNow;
        next();
      }
    })
  } else {
    console.log('Unauthorized ---- '+req.method + ':  ' + process.env.BASE_URL + req.baseUrl)
    res.redirect('/login-voter');
    // res.status(401).json({ ok: false, msg: "Unauthorized request >_<" })
  }
  // next()
}
export const requireAdminAuth = (req, res, next) => {

  let token = req.cookies._x__r_a_y__m_u_m_m_y_;
  if (token) {
    jwt.verify(token, process.env.secreTokenKeyForAdmin, (err, dt) => {
      if (err) {
        // res.redirect('/login-voter')
        console.log(req.method + ':  ' + process.env.BASE_URL + req.baseUrl)
        res.status(401).json({ ok: false, msg: "Unauthorized request >_<" })
      } else {
        // console.log(dt)
        // res.locals.fm = fm;
        // res.locals.formatDistanceToNow = formatDistanceToNow;
        next();
      }
    })
  } else {
    console.log(req.method + ':  ' + process.env.BASE_URL + req.baseUrl)
    res.status(401).json({ ok: false, msg: "Unauthorized request >_<" })
    // res.redirect('/login');
  }
  // next()
}

export const checkVotingCommenced = async (req, res, next) => {
  const admin = await Admin.findOne({ where: { pass_name: 'kingchi' } })
  if (admin.votingCommenced) return next()
  return res.status(404).json({ ok: false, msg: "Voting process has not yet commenced or already ended" })
};

// save avatar
// let avatar_name_;
// /*const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // cb(null, '/uploads')
//     cb(null, 'C:/Users/king/Desktop/voting-system/uploads')
//   }
//   , filename: function (req, file, cb) {
//     let temp_file_arr = file.originalname.split('.')
//     let temp_file_name = temp_file_arr[0]
//     let temp_file_extension = temp_file_arr[1]
//     const accepted_file = ["jpeg", "png", "jpg"]
//       cb(null, avatar_name_)
//     if (accepted_file.includes(temp_file_extension)) {
//       avatar_name_ = `${temp_file_name}_${Date.now()}_${Math.round(Math.random() * 1E9)}.${temp_file_extension}`
//       // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       req.locals = { avatar_name_ }
//     } else {}
//   }
// })*/
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '../uploads')
//   }
//   , filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix)
//   }
// })

// // export const upload = multer({storage}).single('avatar')
// export const upload = multer({ storage: storage }).single('avatar')
// // upload(req, res, function (err) {
// //   console.log(err)
// //   res.locals.avatar_name = avatar_name
// //   if (err) return res.status(505)
// //     .json({ ok: false, msg: 'Error Uploading image' })
// // })
// export const handleUploadErr = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     res.status(400).json({ ok: false, msg: err.message })
//   }
// }