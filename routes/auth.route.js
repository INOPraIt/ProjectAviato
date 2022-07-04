const {Router} = require('express');
const router = Router();
const User = require('../models/User');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwtToken = require('jsonwebtoken')

router.post('/registration', 
  [
    check('email', 'No correction email').isEmail(), //Checking email
    check('password', 'No correction password').isLength({min: 6}) //Checking password
  ],
async (req, res) => {
  try {
    const errors =  validationResult(req) //Checking error
    if(!errors.isEmpty()){
      return res.status(400).json({
        errors: errors.array(),
        message: 'no correction data registration'
      })
    }

    const {email, password} = req.body

    const isUsed = await User.findOne({email})
    
    if(isUsed){
      return res.status(300).json({message: "Email is busy"})
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = new User({ //create new user
      email, password: hashedPassword
    });

    await user.save();

    res.status(201).json({message: 'User created'})

  } catch (error) {
    console.log(error); 
  }
})


router.post('/login', 
  [
    check('email', 'No correction email').isEmail(), //Checking email
    check('password', 'No correction password').exists() //Checking password
  ],
async (req, res) => {
  try {
    const errors =  validationResult(req) //Checking error
    if(!errors.isEmpty()){
      return res.status(400).json({
        errors: errors.array(),
        message: 'no correction data registration'
      })
    }

    const {email, password} = req.body

    const user = await User.findOne({ email })

    if(!user){
      return res.status(400).json({message: 'No email for in database'})
    }

    const isMatched = bcrypt.compare(password, user.password)

    if(!isMatched){
      return res.status(400).json({message: 'Password no matched'})
    }

    const jwtSecret = 'fsees43659fsderfes=sfdeergdrgdgrt9=ydrfesfsgfvdsrgv'

    const token = jwtToken.sign(
      {userId: user.id},
      jwtSecret,
      {expiresIn: '1h'}
    )

    res.json({token, userId: user.id})

    res.status(201).json({message: 'User created'})

  } catch (error) {
    console.log(error); 
  }
})

module.exports = router;