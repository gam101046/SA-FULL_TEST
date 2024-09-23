
import { Avatar, Button, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { MessageInterface } from "../../../interfaces/ IMessage";
import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import {
  CreateMessage,
  GetMemberById,
  GetMemberBySeller,
  GetMessage,
  GetRoomChatByMemberAndSellerID,
  RoomChatByMemberID,
  GetSellerByMemberId,
} from "../../../services/http/index";
import "../test.css";
import { MemberInterface } from "../../../interfaces/Member";


interface MemberBySeller {
  MemberID: number;
  Username: string;
  Password: string;
  Email: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Address: string;
  ProfilePic: string;
  SellerID: string;
}

const Test: React.FC = () => {
  const navigate = useNavigate();
  const [chatMembers, setChatMembers] = useState<MemberBySeller[]>([]);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [inputMessage, setInputMessage] = useState("");
  const [roomChatID, setRoomChatID] = useState<number | null>(null);
  const [selectedSellerID, setSelectedSellerID] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const senderID = 2; // ID ของผู้ส่งข้อความ

  // ส่วนที่เพิ่มมาใหม่ ****start
  const [mid, setMid] = useState<number | null>(null); // เริ่มต้นด้วย null
  const [member, setMember] = useState<MemberInterface | null>(null);

  const GetMemberId = async (member_id: number) => {
    try {
      let res = await GetMemberById(member_id);
      if (res.status === 200) {
        setMember(res.data);
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
      });
    }
  };


  useEffect(() => {
    const storedId = Number(localStorage.getItem("id"));
    if (storedId) {
      setMid(Number(storedId));
    }
  }, []);

  // useEffect ที่ใช้ในการเรียก GetMemberId เมื่อ mid เปลี่ยนแปลงและไม่เป็น null
  useEffect(() => {
    if (mid !== null) {
      console.log(mid);
      GetMemberId(mid);
    }
  }, [mid]);
  // ส่วนที่เพิ่มมาใหม่******* end

  const onFinish = async () => {
    if (!inputMessage.trim()) {
      messageApi.open({ type: "error", content: "กรุณากรอกข้อความ" });
      return;
    }

    if (roomChatID === null) {
      messageApi.open({ type: "error", content: "ไม่พบห้องแชท" });
      return;
    }

    const messageData: MessageInterface = {
      room_chat_id: roomChatID,
      content: inputMessage,
      sender_id: senderID,
    };

    try {
      const res = await CreateMessage(messageData);
      if (res) {
        messageApi.open({ type: "success", content: "บันทึกข้อความสำเร็จ" });
        setInputMessage("");
        fetchMessages();
      } else {
        messageApi.open({ type: "error", content: "เกิดข้อผิดพลาด !" });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการส่งข้อความ",
      });
    }
  };

  const fetchMessages = async () => {
    if (roomChatID === null) return;
    setLoading(true);
    try {
      const data = await GetMessage(roomChatID);
      setMessages(Array.isArray(data) ? data : [data]);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อความ",
      });
    }
    setLoading(false);
  };

  const fetchChatMembers = async () => {
    if (mid === null) {
      messageApi.open({ type: "error", content: "ไม่พบ ID สมาชิก" });
      return;
    }
  
    setLoading(true);
    try {
      const rooms = await RoomChatByMemberID(mid); // mid is guaranteed to be a number here
      const memberPromises = rooms.map(async (room: any) => {
        if (room.SellerID) {
          const sellerData = await GetMemberBySeller(room.SellerID);
          if (sellerData) {
            return { ...sellerData, SellerID: room.SellerID };
          }
        }
        return null;
      });
  
      const members = await Promise.all(memberPromises);
      setChatMembers(members.filter((member) => member !== null) as MemberBySeller[]);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงรายชื่อคนที่เราแชทด้วย",
      });
    }
    setLoading(false);
  };
  

  useEffect(() => {
    if (mid !== null) {
      fetchChatMembers();
    }
  }, [mid]);

  useEffect(() => {
    if (selectedSellerID) {
      fetchMessages();
    }
  }, [selectedSellerID]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChatMemberSelect = async (sellerID: string) => {
    if (mid === null) {
      messageApi.open({ type: "error", content: "ไม่พบ ID สมาชิก" });
      return;
    }
    const sellerIDNumber = Number(sellerID);
    try {
      const room = await GetRoomChatByMemberAndSellerID(mid, sellerIDNumber); // mid is guaranteed to be a number here
      if (room && room.RoomID) {
        setRoomChatID(room.RoomID);
        setSelectedSellerID(sellerID);
      } else {
        messageApi.open({ type: "error", content: "ไม่พบห้องแชท" });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลห้องแชท",
      });
    }
  };
  

  const selectedChatMember = chatMembers.find(
    (member) => member.SellerID === selectedSellerID
  );
  const handleHome = async () => {
    if (mid === null) {
      messageApi.open({ type: "error", content: "ไม่พบ ID สมาชิก" });
      return;
    }
  
    try {
      const sellerData = await GetSellerByMemberId(mid);
      if (sellerData && sellerData.error) {
        messageApi.open({
          type: "error",
          content: sellerData.error,
        });
        navigate('/HomeMember');
      } else if (sellerData) {
        navigate('/HomeSeller');
      } else {
        navigate('/HomeMember');
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ขาย",
      });
    }
  };
  
  
  return (
    <div className="container">
      {/* {contextHolder} */}
      <div className="sidebar">
        <input type="text" placeholder="ค้นหา (3K)" />
        {chatMembers.length > 0 ? (
          chatMembers.map((chatMember) => (
            <div
              className="contact"
              key={chatMember.MemberID}
              onClick={() => handleChatMemberSelect(chatMember.SellerID)}
            >
              <Avatar
                src={chatMember.ProfilePic}
                alt={`Contact ${chatMember.MemberID}`}
                size="large"
              />
              <div>
                {chatMember.FirstName} {chatMember.LastName}
              </div>
              <div className="status"></div>
            </div>
          ))
        ) : (
          <div>ไม่มีสมาชิกที่แชทด้วย</div>
        )}
      </div>

      <div className="chat">
        <div className="chat-header">
        <div className="home-icon">
               <HomeOutlined onClick={handleHome}/>
             </div>
          {selectedChatMember && (
            <>
              <Avatar src={selectedChatMember.ProfilePic} alt="Profile" size="large" />
              <div>
                {selectedChatMember.FirstName} {selectedChatMember.LastName}
              </div>
            </>
          )}
          <div className="icons">
            <i className="fas fa-phone"></i>
            <i className="fas fa-video"></i>
          </div>
        </div>

        <div className="chat-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.SenderID === senderID ? "current-user" : "other-user"
              }`}
            >
              <div className="text">{msg.Content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-footer">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            onKeyDown={(e) => e.key === "Enter" && onFinish()}
          />
          <Button type="primary" onClick={onFinish} style={{ marginLeft: "10px" }}>
            ส่ง
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Test;
