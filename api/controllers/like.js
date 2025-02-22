import  jwt from "jsonwebtoken";
import { db } from "../connect.js";
import moment from "moment"

export const getLikes =(req,res) =>{
             
                const q = "SELECT userId from likes WHERE postId =?";
           
            
                db.query(q, [req.query.postId], (err, data) => {
                  if (err) return res.status(500).json(err);
                  return res.status(200).json(data.map(like => like.userId));
                });
              };



                    // export const addLike = (req, res) => {
                     
                    //     if (err) return res.status(403).json("Token is not valid!");
                    
                    //     const q = "INSERT INTO likes( `userId`, `postId`) VALUES (?)";
                    //     const values = [
                    //       userInfo.id,
                    //       req.body.postId
                    //     ];
                    
                    //     db.query(q, [values], (err, data) => {
                    //       if (err) return res.status(500).json(err);
                    //       return res.status(200).json("Post has been liked.");
                    //     });
                    // };

                    export const addLike = (req, res) => {
                        // Get token
                        const token = req.cookies.accessToken;
                        if (!token) return res.status(401).json("Not logged in!");
                      
                        jwt.verify(token, "secretkey", (err, userInfo) => {
                          if (err) return res.status(403).json("Token is not valid!");
                      
                          const q = "INSERT INTO likes( `userId`, `postId`) VALUES (?)";
                          const values = [
                            userInfo.id,
                            req.body.postId
                          ];
                      
                          db.query(q, [values], (err, data) => {
                            if (err) return res.status(500).json(err);
                            return res.status(200).json("Post has been liked.");
                          });
                        });
                      };


                       

                        

// export const deleteLike = (req, res) => {
//   console.log("Delete like function called");

//   // Extract user info (assuming it's stored in req.user)
//   const userId = req.user?.id;
//   if (!userId) return res.status(401).json("Unauthorized");

//   const q = "DELETE FROM likes WHERE userId = ? AND postId = ?";  

//   db.query(q, [userId, req.query.postId], (err, data) => {
//     if (err) {
//       console.error("Error deleting like:", err);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }

//     if (data.affectedRows === 0) {
//       return res.status(404).json({ message: "Like not found" });
//     }

//     return res.status(200).json("Post has been disliked");
//   });
// };
export const deleteLike = (req, res) => {
    console.log("Delete like function called");
    
    // Get token
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q = "DELETE FROM likes WHERE userId = ? AND postId = ?";  
  
      db.query(q, [userInfo.id, req.query.postId], (err, data) => {
        if (err) {
          console.error("Error deleting like:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
  
        if (data.affectedRows === 0) {
          return res.status(404).json({ message: "Like not found" });
        }
  
        return res.status(200).json("Post has been disliked");
      });
    });
  };