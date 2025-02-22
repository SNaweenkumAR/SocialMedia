import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import moment from "moment"
import { makeRequest } from "../../axios";
import { useQuery ,useQueryClient,useMutation} from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);

  const {currentUser} = useContext(AuthContext);

  const { data, isLoading, error } = useQuery({
    queryKey: ["likes",post.id],
    queryFn: async () => {
      try {
        const res = await makeRequest.get("/likes?postId="+post.id, { withCredentials: true });
        console.log("✅ Fetched Posts:", res.data);
        return res.data;
      } catch (err) {
        console.error("❌ API Fetch Error:", err.response?.data || err);
        throw err;
      }
    },
  });

  const queryClient = useQueryClient();

  // const mutation = useMutation({
  //   mutationFn: async (liked) => {
  //     if(liked) return makeRequest.delete("/likes?postId="+ post.id); // ✅ Use makeRequest (if it's used for requests)
  //     return makeRequest.post("/likes",{ postId : post.id })
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["likes",post.id]); // ✅ Moved inside the first object
  //   },
  // });
  const mutation = useMutation({
    mutationFn: async (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    onMutate: async (liked) => {
      await queryClient.cancelQueries(["likes", post.id]);
  
      const previousLikes = queryClient.getQueryData(["likes", post.id]);
  
      queryClient.setQueryData(["likes", post.id], (oldData) => {
        if (!oldData) return [];
        return liked
          ? oldData.filter((id) => id !== currentUser.id) // Remove like
          : [...oldData, currentUser.id]; // Add like
      });
  
      return { previousLikes };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["likes", post.id], context.previousLikes);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["likes", post.id]); // Ensure fresh data
    },
  });
  

  const handleLike = () => {
    if (data) {
      mutation.mutate(data.includes(currentUser.id));
    }
  };
 
  // const [isPending, setIsPending] = useState(false);

  // const handleLike = async () => {
  //   if (isPending) return; // Prevent multiple clicks while waiting
  
  //   setIsPending(true); // Start loading state
  
  //   mutation.mutate(data.includes(currentUser.id), {
  //     onSettled: () => setTimeout(() => setIsPending(false), 200), // Small delay for smooth UI update
  //   });
  // };
  

  // Default images
  const defaultProfilePic = "https://via.placeholder.com/50";
  const defaultPostImage = "https://via.placeholder.com/600";

  if (!post) return null; // Prevent rendering if post is undefined

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post?.profilePic || defaultProfilePic} alt="Profile" />
            <div className="details">
              <Link
                to={`/profile/${post?.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post?.name || "Unknown User"}</span>
              </Link>
              <span className="date">{moment(post.createAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="content">
          <p>{post.desc}</p>
           <img src={"./upload/" + post.img} alt="Post" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ?  "Loading" : data?.includes(currentUser.id) ? <FavoriteOutlinedIcon style={{color:"red"}} onClick={handleLike}/> : <FavoriteBorderOutlinedIcon onClick={handleLike} />}
            {data?.length} Likes
          </div>
          
          {/* <div className="item">
  {isLoading || isPending ? (
    "Loading"
  ) : data?.includes(currentUser.id) ? (
    <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} />
  ) : (
    <FavoriteBorderOutlinedIcon onClick={handleLike} />
  )}
  {data?.length} Likes
</div> */}

          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id}/>}
      </div>
    </div>
  );
};

export default Post;
