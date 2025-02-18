import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";

const Posts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await makeRequest.get("/posts", { withCredentials: true });
        console.log("✅ Fetched Posts:", res.data);
        return res.data;
      } catch (err) {
        console.error("❌ API Fetch Error:", err.response?.data || err);
        throw err;
      }
    },
  });

  if (isLoading) return <p>Loading posts...</p>;
  if (error) return <p>Error fetching posts!</p>;

  return (
    <div className="posts">
      {data?.length > 0 ? (
        data.map((post) => <Post key={post.id} post={post} />) // Change from `data={post}` to `post={post}`
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default Posts;
