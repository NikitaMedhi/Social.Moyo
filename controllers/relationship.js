import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import graphlib from "graphlib";

app.get('/users', (req, res)=>{
    const query = 'SELECT * FROM users';
    db.query(query, (err, results)=>{
        if (err) throw err;
        res.send(results);
    });
});

app.get('/relationships', (req, res)=>{
    const query = 'SELECT * FROM relationships';
    db.query(query, (err, results)=>{
        if (err) throw err;
        res.send(results);
    });
});


const users = [
    userInfo.id,

]


const g=new graphlib.Graph();

users.forEach(user =>{
    g.setNode(user.id, user);
});

relationships.forEach(relationship =>{
    g.setEdge(relationship.followerUserid, relationship.followedUserid);
});

export const getRelationship = (req,res)=>{

            const id = parseInt(req.params.id);
            const friends = graphlib.alg.neighbors(g, id);
            res.send(friends);
        };

export const addRelationship =(req,res)=>{
            const token = req.cookies.accessToken;
            if(!token) return res.status(401).json("Not logged in!");
        
            jwt.verify(token, "secretkey", (err, userInfo)=>{
                if (err) return res.status(403).json("Token is not valid!");
            
            const followerUserid = parseInt(req.body.followerUserid);
            const followedUserid = parseInt(req.body.followedUserid);
            g.setEdge(followerUserid, followedUserid);
            const query = `INSERT INTO relationships (followerUserid, followedUserid) VALUES (?)`;

            const values = [
                userInfo.followerUserid,
                userInfo.followedUserid
            ]

            db.query(query, (err, results)=>{
                if (err) return res.status(500).json(err);
                return res.status(200).json("User followed successfully");
            })
            });
            };       

export const deleteRelationship =(req,res)=>{
            const token = req.cookies.accessToken;
            if(!token) return res.status(401).json("Not logged in!");
        
            jwt.verify(token, "secretkey", (err, userInfo)=>{
                if (err) return res.status(403).json("Token is not valid!");

                const followerUserid = parseInt(req.body.followerUserid);
                const followedUserid = parseInt(req.body.followedUserid);
                g.removeEdge(followerUserid, followedUserid);
                const query = "DELETE FROM relationships WHERE `followerUserid` = (?) AND `followedUserid` = (?)";
    
                db.query(query, [userInfo.followerUserId, userInfo.followedUserId], (err, results)=>{
                    if (err) return res.status(500).json(err);
                    return res.status(200).json("User has been unfollowed");
                });
            });
        };