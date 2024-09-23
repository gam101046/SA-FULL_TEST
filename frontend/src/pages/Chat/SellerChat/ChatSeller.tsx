
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, message, Button } from "antd";
import { MessageInterface } from "../../../interfaces/ IMessage";
import { CreateMessage, GetMember, GetMessage, RoomChatBySellerID, GetRoomChatByMemberAndSellerID, GetSellerByMemberId } from "../../../services/http";
import '../test.css';
import { SellerInterface } from '../../../interfaces/Seller';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

interface Member {
  MemberID: number;
  Username: string;
  Password: string;
  Email: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Address: string;
  ProfilePic: string;
}

const Test: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [inputMessage, setInputMessage] = useState("");
  const [roomChatID, setRoomChatID] = useState<number | null>(null);
  const [selectedSellerID, setSelectedSellerID] = useState<number | null>(null);
  const [chatMembers, setChatMembers] = useState<Member[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [seller, setSeller] = useState<SellerInterface | null>(null);
  const [sellerID, setSellerID] = useState<number | null>(null); // ตั้งค่า sellerID

  const senderID = 1; // ID ของผู้ส่งข้อความ

  // Function to fetch seller by member_id
  const fetchSeller = async (member_id: number) => {
    const res = await GetSellerByMemberId(member_id); // Call the function
    if (!res.error) {
      setSeller(res.seller); // Set the seller object
      setSellerID(res.seller_id); // Set the seller ID
    } else {
      message.error(res.error); // Display error message if any
    }
  };

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
        fetchMessages(); // เรียกดึงข้อความใหม่หลังจากส่งข้อความสำเร็จ
      } else {
        messageApi.open({ type: "error", content: "เกิดข้อผิดพลาด !" });
      }
    } catch (error) {
      messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการส่งข้อความ" });
    }
  };

  const fetchMessages = async () => {
    if (roomChatID === null) return;
    setLoading(true);
    try {
      const data = await GetMessage(roomChatID);
      setMessages(Array.isArray(data) ? data : [data]);
    } catch (error) {
      messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการดึงข้อความ" });
    }
    setLoading(false);
  };

  const fetchChatMembers = async () => {
    if (!sellerID) return; // ตรวจสอบว่า sellerID ไม่เป็น null
    setLoading(true);
    try {
      const rooms = await RoomChatBySellerID(sellerID);
      console.log('Rooms:', rooms); // ตรวจสอบว่าได้ค่าห้องถูกต้องหรือไม่
      const memberPromises = rooms.map(async (room: any) => {
        if (room.MemberID) {
          const memberData = await GetMember(room.MemberID);
          console.log('Member Data:', memberData); // ตรวจสอบว่าข้อมูลสมาชิกที่ได้ถูกต้องหรือไม่
          if (memberData) {
            return Array.isArray(memberData) ? { ...memberData[0], MemberID: room.MemberID } : { ...memberData, MemberID: room.MemberID };
          }
        }
        return null;
      });
  
      const members = await Promise.all(memberPromises);
      setChatMembers(members.filter((member) => member !== null) as Member[]);
    } catch (error) {
      messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการดึงรายชื่อคนที่เราแชทด้วย" });
    }
    setLoading(false);
  };
  
  useEffect(() => {
    const memberId = Number(localStorage.getItem("id")); // Assuming member_id is stored in localStorage
    if (memberId) {
      fetchSeller(memberId); // Fetch seller using the member ID
    }
  }, []);

  useEffect(() => {
    if (sellerID) {
      fetchChatMembers(); // ดึงรายชื่อคนที่เคยแชทด้วยเมื่อ sellerID เปลี่ยนแปลง
    }
  }, [sellerID]);

  useEffect(() => {
    if (selectedSellerID) {
      fetchMessages(); // ดึงข้อความเมื่อมีการเลือกผู้ใช้ที่ต้องการแชทด้วย
    }
  }, [selectedSellerID]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChatMemberSelect = async (memberID: number) => {
    try {
      if (!sellerID) return; // ตรวจสอบว่า sellerID ไม่เป็น null ก่อนที่จะเรียก API
      const room = await GetRoomChatByMemberAndSellerID(memberID, sellerID);
      if (room && room.RoomID) {
        setRoomChatID(room.RoomID);
        setSelectedSellerID(memberID); // ใช้ memberID แทน sellerID
      } else {
        messageApi.open({ type: "error", content: "ไม่พบห้องแชท" });
      }
    } catch (error) {
      messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการดึงข้อมูลห้องแชท" });
    }
  };

  const handleHome = () => {
    navigate('/HomeSeller');
  };

  const selectedChatMember = chatMembers.find(member => member.MemberID === selectedSellerID);

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
              onClick={() => handleChatMemberSelect(chatMember.MemberID)}
            >
              <Avatar src={chatMember.ProfilePic} alt={`Contact ${chatMember.MemberID}`} size="large" />
              <div className="contact-info">
                <div className="contact-name">{chatMember.FirstName} {chatMember.LastName}</div>
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
              <div className="chat-member-info">
                <div className="chat-member-name">{selectedChatMember.FirstName} {selectedChatMember.LastName}</div>
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
              className={`message ${msg.SenderID === senderID ? 'current-user' : 'other-user'}`}
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
            onKeyDown={(e) => e.key === 'Enter' && onFinish()}
          />
          <Button type="primary" onClick={onFinish} style={{ marginLeft: '10px' }}>
            ส่ง
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Test;