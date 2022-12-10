const express =  require('express');
const { allUsers , userById , getUser,updateUser,deleteUser} = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');


const router = express.Router();



//get all user
router.get('/users', allUsers);
//get single user 
router.get('/user/:userId',requireSignin, getUser); 
//update user
router.put('/user/:userId',requireSignin, updateUser); 
//delete a user
router.delete('/user/:userId',requireSignin, deleteUser); 

//Any route containing userid , our app will first execute userById()
router.param("userId", userById)


module.exports = router;