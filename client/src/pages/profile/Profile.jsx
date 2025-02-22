import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { makeRequest } from "../../axios";
import { useQuery ,useQueryClient,useMutation} from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";

const Profile = () => {

  const userId =useLocation().pathname.split("/")[2];
  
  
    const {currentUser} = useContext(AuthContext);
  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await makeRequest.get("/users/find/"+ userId, { withCredentials: true });
        console.log("✅ Fetched Posts:", res.data);
        return res.data;
      } catch (err) {
        console.error("❌ API Fetch Error:", err.response?.data || err);
        throw err;
      }
    },
  });

  console.log(typeof(userId));

  return (
    <div className="profile">
      <div className="images">
        <img
          src={data?.coverPic}
          alt=""
          className="cover"
        />
        <img
          src={data?.profilePic}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://instagram.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://twitter.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://linkedin.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://pinterest.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data?.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data?.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data?.website}</span>
              </div>
            </div>
           { userId === currentUser.id ? (<button> Update</button>) : <button>follow</button>}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
      <Posts/>
      </div>
    </div>
  );
};

export default Profile;
