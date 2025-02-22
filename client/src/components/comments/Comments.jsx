import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {  // ✅ Correct destructuring
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["comments", postId],  // ✅ Include postId in cache key
  //   queryFn: async () => {
  //     try {
  //       const res = await makeRequest.get(`/comments?postId=${postId}`, { withCredentials: true });
  //       console.log("✅ Fetched Comments:", res.data);
  //       return res.data || [];  // ✅ Ensure it's an array
  //     } catch (err) {
  //       console.error("❌ API Fetch Error:", err.response?.data || err);
  //       return [];
  //     }
  //   },
  // });

  const { data, isLoading, error } = useQuery({
    queryKey: ["comments", postId], // ✅ Include postId for unique queries
    queryFn: async () => {
      try {
        const res = await makeRequest.get(`/comments?postId=${postId}`);
        console.log("✅ Fetched Comments:", res.data); // ✅ Log response
        return res.data;
      } catch (err) {
        console.error("❌ API Fetch Error:", err.response?.data || err);
        throw err;
      }
    },
  });
  

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);  // ✅ Invalidate correct query
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="User" />
        <input type="text" placeholder="Write a comment..." onChange={e => setDesc(e.target.value)} value={desc} />
        <button onClick={handleClick}>Send</button>
      </div>
      
      {isLoading ? (
        <p>Loading...</p>
      ) : data?.length > 0 ? (
        data.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={comment.profilePic} alt="Commenter" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">{moment(comment.createAt).fromNow()}</span>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

export default Comments;
