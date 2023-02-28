import jwt from 'jsonwebtoken'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { Admin, Voter } from '../models/model-config.js'



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

export const requireVoterAuth = async  (req, res, next) => {

  let token = req.cookies._x_ray_mo_;
  if (token) {
    jwt.verify(token, process.env.secreTokenKey, async (err, dt) => {
      if (err) {
        console.log('Unauthorized ---- '+req.method + ':  ' + process.env.BASE_URL + req.baseUrl)
        res.locals.user = null;
        res.redirect('/v1.0/login-voter')
        // res.status(401).json({ ok: false, msg: "Unauthorized request >_<" })
      } else {
        let voter = await Voter.findOne({where:{_id:dt.id}});
        res.locals.voter = voter;
        next();
      }
    })
  } else {
    res.locals.user = null;
    console.log('Unauthorized ---- '+req.method + ':  ' + process.env.BASE_URL + req.baseUrl)
    res.redirect('/v1.0/login-voter');
    // res.status(401).json({ ok: false, msg: "Unauthorized request >_<" })
  }
  // next()
}

export const requireAdminAuth = (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.secreTokenKeyForAdmin, (err, dt) => {
      if (err) {
        // res.redirect('/v1.0/login-voter')
        console.log(req.method + ':  ' + process.env.BASE_URL + req.baseUrl)
        res.status(401).json({ ok: false, msg: "Unauthorized request >_<", not_logged_in:true })
      } else {
        // console.log(dt)
        // res.locals.fm = fm;
        // res.locals.formatDistanceToNow = formatDistanceToNow;
        next();
      }
    })
  } else {
    console.log(req.method + ':  ' + process.env.BASE_URL + req.baseUrl)
    res.status(401).json({ ok: false, msg: "Unauthorized request >_<", not_logged_in:true })
    // res.redirect('/login');
  }
  // next()
}

export const checkVotingCommenced = async (req, res, next) => {
  const admin = await Admin.findOne({ where: { pass_name: 'kingchi' } })
  if (admin.votingCommenced) return next()
  return res.status(404).json({ ok: false, msg: "Voting process has not yet commenced or already ended" })
};