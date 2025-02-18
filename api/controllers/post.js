import { db } from "../connect.js";
import jwt from "jsonwebtoken"
import moment from "moment/moment.js";

export const getPosts = (req, res) => {

const token = req.cookies.accessToken;

if(!token) return res.status(401).json("Not Logged In");

jwt.verify(token,"secretkey",(err,userInfo) => {
    if(err) return res.status(403).json("Token is Invalid");



const q = `
    SELECT p.*, u.id AS userId, name, profilePic 
    FROM posts AS p
    JOIN users AS u ON (u.id = p.userId)
    LEFT JOIN relationship AS r ON (p.userId = r.followedUserId) 
    WHERE r.followerUserId = ? OR p.userId=?
      ORDER BY p.createAt DESC;
`;

db.query(q, [userInfo.id, userInfo.id], (err, data) => {
    if (err) {
        console.error("❌ Database query error:", err);
        return res.status(500).json({ message: "Database query failed", error: err });
    }

    console.log("🟢 SQL Query Executed Successfully");
    console.log("👤 User Info:", userInfo);
    console.log("📝 Retrieved Posts:", data);

    if (!data || data.length === 0) {
        console.warn("⚠️ No posts found for user:", userInfo.id);
        return res.status(404).json({ message: "No posts found" });
    }

    return res.status(200).json(data);
});



})

 
};



export const addPosts = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not Logged In");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is Invalid");

        // 🔹 Fix Column Name: Ensure it matches your table
        const q = "INSERT INTO posts (`desc`, `img`, `createAt`, `userId`) VALUES (?)";

        const values = [
            req.body.desc,  
            req.body.img,   
            moment().format("YYYY-MM-DD HH:mm:ss"), 
            userInfo.id     
        ];

        db.query(q, [values], (err, data) => {
            if (err) {
                console.error("❌ Database query error:", err);
                return res.status(500).json({ message: "Database query failed", error: err });
            }

            return res.status(200).json("Post has been created");
        });
    });
};
