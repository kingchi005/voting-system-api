import Joi from 'joi'

export const pollSchema = Joi.object({
  // office_ids: Joi.array() .required()
  aspirant_ids: Joi.array()
    .required().min(1).message('Vote atleast one candidate')
})

export const voterSchema = Joi.object({
  reg_nos: Joi.array().min(5).max(30)
    .required()
  // .messages({'string.empty': 'Password is required'})
  // , token: Joi.string()
  //   .min(6)
  //   .message('Password length must be at least 6 characters long')
  //   .required()
  //   .messages({ 'string.empty': 'Password is required' })
  // , token: Joi.string()
  //   .required()
  //   .messages({ 'string.empty': 'Enter a token' })
})


export const aspirantSchema = Joi.object({
  first_name: Joi.string()
    .required()
    .messages({ 'string.empty': 'First name is required' })
  , other_names: Joi.string()
    .required()
    .messages({ 'string.empty': 'Enter at least one other name' })
  , department: Joi.string()
    .messages({ 'string.empty': 'Please enter a department' })
  , avatar: Joi.string().required().messages({"string.empty":"Please choose a profile picture"})
  , office_id: Joi.number()
    .required()
    .messages({ 'number.empty': 'Select an office' })

})

export const aspirantSchema_update = Joi.object({
  first_name: Joi.string()
    .required()
    .messages({ 'string.empty': 'First name is required' })
  , other_names: Joi.string()
    .required()
    .messages({ 'string.empty': 'Enter at least one other name' })
  , department: Joi.string()
    .messages({ 'string.empty': 'Please enter a department' })
  , avatar: Joi.string().min(0)
  , office_id: Joi.number()
    .required()
    .messages({ 'number.empty': 'Select an office' })

})

export const login_voterSchema = Joi.object({
  reg_no: Joi.number().required().messages({ 'number.empty': 'Reg No is required' })
  , _token: Joi.string().required().messages({ 'string.empty': 'Enter a token' })
})

export const login_adminSchema = Joi.object({
  pass_name: Joi.string().required().messages({ 'number.empty': 'Reg No is required' })
  , pass_token: Joi.string().required().messages({ 'string.empty': 'Enter a token' })
})


// export default {aspirantSchema}