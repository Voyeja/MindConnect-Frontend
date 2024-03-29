import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./side.css";
import { BsCheckCircleFill } from 'react-icons/bs';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';

interface Group {
  id: string;
  groupName: string;
}

interface FetchGroupsResponse {
  message: string;
  result: Group[];
}

const Side = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in local storage');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get<FetchGroupsResponse>(
        'http://localhost:4000/group/all',
        config
      );
      const fetchedGroups = response.data.result;
      setGroups(fetchedGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);


  const handleJoinGroup = async (group: Group) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in local storage');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `http://localhost:4000/group/group/${group.id}/join`,
        { id: group.id },
        config
      );

      const joinedGroup = response.data.group;
      console.log('Joined Group:', joinedGroup);

      setSelectedGroup(joinedGroup);
      setShowModal(true);

      // Optionally, you can refetch the groups to update the UI
      fetchGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      // Show error message or handle the error condition
    }
  };

  const handleCloseModal = () => {
    setSelectedGroup(null);
    setShowModal(false);
  };


  const handleDoneClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowModal(false);
    console.log('Done clicked');
  };

  return (
    <div className='side-section'>
      <div className="side-section-frame">
        <div className="box1">
          <h4>Suggestions</h4>
          <hr />
          <h2>Popular Groups</h2>
          <p>Here is a list of some very active groups you might be interested based on your location and engagements.</p>
          <div className="groups">
            {Array.isArray(groups) && groups.length > 0 ? (
              groups.map((group) => (
                <div key={group.id} className="group">
                  <p className="groupN">{group.groupName}</p>
                  <span style={{cursor: "pointer"}} onClick={() => handleJoinGroup(group)}>
                    Join
                  </span>
                </div>
              ))
            ) : (
              <p>No groups available</p>
            )}
          </div>
        </div>
       
      {showModal && selectedGroup && (
        <div className="joined-modal-wrapper">
          <div className="joined-modal" onClick={handleCloseModal}>
            <div className="joinedModal">
              <div className="">
                <span>
                  <BsCheckCircleFill className="icon" />
                </span>
              </div>
              <div className="joinedBody">
                <h4 className="joinedhead">Joined group</h4>
              </div>
              <div className="joinedBody">
                <p className="joinedP">
                  You can now view, interact, and make posts in the {selectedGroup.groupName} group.
                </p>
              </div>
              <div className="button">
                <div>
                  <Button
                    height="44px"
                    width="67px"
                    backgroundColor="#F2F4F7"
                    color="#101828"
                    onClick={handleDoneClick}
                  >
                    Done
                  </Button>
                </div>
                <div>
                  <Link to={"/joinedgroup/"+selectedGroup.id}>
                    <Button height="44px" width="119px" backgroundColor="#175CD3" color="#fff">
                      Visit group
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      <div className="box2">
      <img src="data:image/jpeg;base64,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" alt="" />
      </div>
      <div className="box3">
      <h4>Messages</h4>
      <hr/>
      <h2>Chats</h2>
      <p>Here is a list of people you chat with frequently. </p>
      <div className="chats">
        <div className="chat">
          <p>Jane Doe</p>
          <span>Online</span>
        </div>
        <div className="chat">
          <p>Jane Doe</p>
          <span className='offline'>Offline</span>
        </div>
        <div className="chat">
          <p>Jane Doe</p>
          <span>Online</span>
        </div> <div className="chat">
          <p>Jane Doe</p>
          <span className='offline'>Offline</span>
        </div>
      </div>
        </div>
      </div> 
      </div>
  )
}

export default Side



