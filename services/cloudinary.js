const cloudinary = require ('cloudinary').v2;
const fs = require('fs');


 // Cloudinary configuration
    cloudinary.config({
        cloud_name: 'ugonna1054',
        api_key: '192544314184282',
        api_secret: 'gke0ewv0H0_-uWzUBvN29ZOSEmY',
    });

    //with transformations
    async function newCloudinary(path, uniqueName) {
        if (path=='') return;
        return new Promise ( async (resolve, reject) =>  {
            await cloudinary.uploader.upload(
                path,
                {   public_id : uniqueName,
                    transformation: [
                       {width: 100, height: 100, gravity: "face", radius: 20, effect: "", crop: "thumb"},
                        // {overlay: "cloudinary_icon", gravity: "south_east", x: 5, y: 5, width: 50, opacity: 60, effect: "brightness:200"},
                       // {angle: 10} //rotates the picture 10 degrees
                    ]
                }    
               )
              .then(data => {
                 fs.unlinkSync(path) //removes path from server
                 resolve(data) 
               })
              .catch(err => {
                  reject(err)
              })      
        })
     }

    //without any transformations
     async function newCloudinary1(path, uniqueName) {
        if (path=='') return;
        return new Promise ( async (resolve, reject) =>  {
            await cloudinary.uploader.upload(
                path,
                {   public_id : uniqueName,
                }    
               )
              .then(data => {
                 fs.unlinkSync(path) //removes path from server
                 resolve(data) 
               })
              .catch(err => {
                  reject(err)
              })      
        })
     }

   
 

   


// exports.cloudinary = cloudinary;
exports.newCloudinary = newCloudinary;
exports.newCloudinary1 = newCloudinary1;