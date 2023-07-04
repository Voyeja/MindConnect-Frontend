import React, { useEffect, useState } from "react";
import { HiArrowNarrowDown, HiArrowNarrowLeft, HiArrowNarrowUp, HiOutlineFlag } from "react-icons/hi";
import "./joinedGroup.css";
import Input from "./input";
import NavBar from "../Navbar/Navbar";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { formatDistanceToNow } from 'date-fns';
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import ClearIcon from "@mui/icons-material/Clear";
import { FcLike } from "react-icons/fc";
import { AiOutlineHeart, AiOutlineComment, AiOutlineFlag } from "react-icons/ai";
import GroupCreateModal from '../GroupCreateModal/GroupCreateModal';
import { BsCheckCircleFill, BsHeart } from "react-icons/bs";
import Button from "../Button/Button";
import ModalImage from "react-modal-image";
import ModalVideo from "react-modal-video";
import "react-modal-video/scss/modal-video.scss";
import { FaRegComment } from "react-icons/fa";
import CommentSection from "../CommentSection/CommentSection";
import { group } from "console";
import { Group } from "@mui/icons-material";

interface Group {
  comment: string;
  liked: any;
  like: any;
  image: string[];
  video: string[];
  postCount: number;
  memberCount: number;
  postContent: string;
  id: string;
  groupName: string;
  about: string;
  userId: string;
  users: any[];
  updatedAt: string;
  createdAt: string;
  User: {
    firstName: string;
    lastName: string;
    profilePhoto: string | undefined;
  };
  file: FileAttributes[];
}
interface FileAttributes {
  url: string;
  name: string;
}
interface PostAttributes {
  User: UserAttributes;
  postContent: string;
  like: [string];
  id: string;
  comments: CommentAttributes;
}
interface UserAttributes {
  firstName: string;
  lastName: string;
  profilePhoto: string;
}

interface FetchGroupsResponse {
  message: string;
  result: Group[];
}

interface CommentAttributes {
  comments: [string];
}

const JoinedGroup: React.FC = () => {
  const [groups, setGroup] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [leaveModal, setLeaveModal] = useState(false);
  const {groupId} =useParams();

  const [posts, setPosts] = useState<PostAttributes[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [visiblePosts, setVisiblePosts] = useState<number>(5);
  const [isVideoModalOpen, setVideoModalOpen] = useState<boolean>(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>("");
  const [showNewerPostsButton, setShowNewerPostsButton] = useState(false);
  const [showOlderPostsButton, setShowOlderPostsButton] = useState(true);
  const [showModalLeave, setShowModalLeave] = useState(false);
 
  const token = localStorage.getItem('token');
  
  const fetchPostsByGroupId = async () => {
    try {
     
      if (!token) {
        console.error('Token not found in local storage');
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        'http://localhost:4000/post/all?groupId='+ groupId,
        config
      );
      toast.success(response.data.message);
      console.log(response.data.posts)
      const fetchPostsByGroupId = response.data.posts;
      setGroup(fetchPostsByGroupId);
    } catch (error) {
      console.error('Error fetching group:', error);
    }
  };

  const fetchGroupData = async () => {
    try {
     
      if (!token) {
        console.error('Token not found in local storage');
        return;
      }
   

      const response = await axios.get(
        'http://localhost:4000/group/group/'+ groupId,
      );

      const fetchPostsByGroupId = response.data.group;
      setSelectedGroup(fetchPostsByGroupId);
    } catch (error) {
      console.error('Error fetching group:', error);
    }
  };

  useEffect(() => {
    fetchPostsByGroupId(); // Fetch posts when the component mounts
    fetchGroupData();
  }, []);

  const handleShowComments = (postId: string) => {
    setSelectedPostId((post) => (post === postId ? null : postId));
  };

  const formatDate = (dateString: string): string => {
    const createdAt = new Date(dateString);
    const distance = formatDistanceToNow(createdAt, { addSuffix: true });
    return distance;
  };

  const handleLike = async (postId: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `http://localhost:4000/post/like-post/${postId}`,
        { postId }, // Pass the postId in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              like: res.data.numberOfLikes,
              liked: res.data.liked,
            };
          }
          return post;
        })
      );

      // Update the liked posts in local storage
      localStorage.setItem(
        "likedPosts",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("likedPosts") || "{}"),
          [postId]: res.data.liked,
        })
      );
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.Error);
    }
  };

  const handleViewOlderPosts = () => {
    setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 5);
    setShowNewerPostsButton(true);
    setShowOlderPostsButton(false);
  };

  const handleViewNewerPosts = () => {
    setVisiblePosts((prevVisiblePosts) => Math.max(prevVisiblePosts - 5, 5));
    setShowNewerPostsButton(false);
    setShowOlderPostsButton(true);
  };

  const handleViewVideoModal = (videoUrl: string) => {
    setSelectedVideoUrl(videoUrl);
    setVideoModalOpen(true);
  };

  const handleLeaveGroup = async (groupId:any )=> {
    try {
      console.log(groupId);
      // const token = localStorage.getItem('token');
      // if (!token) {
      //   console.error('Token not found in local storage');
      //   return;
      // }

      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // };

      // const response = await axios.post(
      //   `http://localhost:4000/group/group/${groupId}/leave`,
      //   { id: groupId},
      //   config
      // );

      // const leaveGroup = response.data.group;
      // console.log('Leave Group:', leaveGroup);

      // setShowModalLeave(true);
     window.location.href = "/dashboard"
      // Optionally, you can refetch the groups to update the UI
     // fetchGroup();
    } catch (error) {
      console.error('Error leaving group:', error);
      // Show error message or handle the error condition
    }
  };

  const handleCloseModal = () => {
    setLeaveModal(false);
  };

  const handleDoneClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLeaveModal(false);
    console.log('Done clicked');
  };

  return (
    <div className="home-section">
      <NavBar />
      
      <div className="heading">
        <div className="navigation">
          <HiArrowNarrowLeft />
          <Link to="/dashboard" className="nav-back">
            Go back
          </Link>
        </div>
        <div>
          <h2 className="group-name">{selectedGroup?.groupName}</h2>
        </div>
        <div>
          <button className="leave-group-button" onClick={() => handleLeaveGroup(selectedGroup?.id)}>
            Leave group
          </button>
        </div>
      </div>



      <Input groupId ={groupId}/>

      {/* {posts.slice(0, visiblePosts).map((post) => ( */}
        {groups
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((group) => (
        <div className="first-post" key={group.id}>
          <div className="top-section">
            <div className="post-user">
              <img className="post-icon" src={group.User?.profilePhoto} alt="" />

              <div className="poster">
                <div className="post-owner">
                  {group.User?.firstName} {group.User?.lastName}
                  <p>{formatDate(group.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="top-icons">
              <IoEllipsisHorizontalSharp className="elipsis" />
              <ClearIcon className="cancel" />
            </div>
          </div>
          <p className="post-details">{group.postContent}</p>
          <div className="image-grid">
            {group.image.map((imageUrl, index) => (
              <div className="image-item" key={index}>
                <ModalImage small={imageUrl} large={imageUrl} alt="" />
              </div>
            ))}
          </div>
          <div className="video-grid">
            {group.video.map((videoUrl, index) => (
              <div
                className="video-item"
                key={index}
                onClick={() => handleViewVideoModal(videoUrl)}
              >
                <video src={videoUrl} controls />
              </div>
            ))}
            {isVideoModalOpen && (
              <div className="modal-container">
                <div className="modal-content">
                  <ModalVideo
                    channel="custom"
                    url={selectedVideoUrl}
                    isOpen={isVideoModalOpen}
                    onClose={() => setVideoModalOpen(false)}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="file-grid">
            {group.file.map((file, index) => (
              <div className="file-item" key={index}>
                <a href={file.url} download={file.name}>
                  File {index + 1}
                </a>
              </div>
            ))}
          </div>
          <div className="like-section">
            <div className="like">
              {group.like ? (
                <FcLike className="like-icon liked" />
              ) : (
                <BsHeart className="like-icon" />
              )}
              <span>{group.like.length}</span>
            </div>
            <p>{group.comment} comments</p>
          </div>
          <hr />
          <div className="comment-like-report">
            <div className="icon" onClick={() => handleLike(group.id)}>
              {group.liked ? (
                <FcLike className="icons liked" />
              ) : (
                <BsHeart className="icons" />
              )}
              <span>Like</span>
            </div>

            <div className="icon" onClick={() => handleShowComments(group.id)}>
              <FaRegComment className="icons" />
              <span>Comment</span>
            </div>
            <div className="icon">
              <HiOutlineFlag className="icons" />
              <span>Report</span>
            </div>
          </div>

          <hr />
          {selectedPostId === group.id && <CommentSection postId={group.id} />}
        </div>
      ))}

      <div className="view-posts">
        {showOlderPostsButton && (
          <div className="view-older-post" onClick={handleViewOlderPosts}>
            <p>
              View Older Posts <HiArrowNarrowDown className="down-icon" />
            </p>
          </div>
        )}

        {showNewerPostsButton && (
          <div className="view-older-post" onClick={handleViewNewerPosts}>
            <p>
              View Newer Posts <HiArrowNarrowUp className="up-icon" />
            </p>
          </div>
        )}
    </div>
    </div>
  );
};

export default JoinedGroup;
